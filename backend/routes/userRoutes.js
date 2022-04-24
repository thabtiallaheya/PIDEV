var express = require("express");
var router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const user = require("../models/user");
const jwt = require("jsonwebtoken");
const { ROLES, inRole } = require("../security/Rolemiddleware");
const ValidateRegister = require("../validation/Register");
const ValidateLogin = require("../validation/Login");
var mailer = require("../utils/mailer");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const fs = require("fs");
let path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "images");
  },
  filename: function (req, file, cb) {
    cb(null, uuidv4() + "-" + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = ["image/jpeg", "image/jpg", "image/png"];
  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

let upload = multer({ storage, fileFilter });

router.get(
  "/getUser",
  passport.authenticate("jwt", { session: false }),
  function (req, res, next) {
    res.json({ user: req.user });
  }
);

/* GET users listing. */
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  inRole(ROLES.ADMIN),
  function (req, res, next) {
    User.find({}, function (err, users) {
      res.send(users);
    });
  }
);

router.post("/", async (req, res, next) => {
  const { isValid } = ValidateRegister(req.body);
  if (!isValid) {
    return res.status(404).json({ message: "invalid data" });
  } else {
    const exist = await user.findOne({ email: req.body.email });
    if (exist) {
      return res.status(400).json({ message: "user exist" });
    } else {
      const hash = bcrypt.hashSync(req.body.password, 10);
      req.body.password = hash;
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        verified: false,
        role: req.body.role === "MENTOR" ? ROLES.MENTOR : ROLES.STUDENT,
      });
      const newUser = await user.save();
      if (newUser) {
        const verificationToken = user.generateVerificationToken();
        mailer.sendVerifyMail(user.email, verificationToken);
        return res.status(200).json({ message: "user added" });
      }
      return res.status(404).json({ message: "error" });
    }
  }
});

router.get("/trainers", function (req, res, next) {
  user.find({ role: "MENTOR" }, (err, docs) => {
    if (err) res.status(400).send({ message: err });
    const users = docs.map((user) => {
      const { password, ...rest } = user.toObject();
      return rest;
    });
    res.status(200).send({ trainers: users, message: "success" });
  });
});

router.post("/follow", function (req, res, next) {
  const { student, mentor } = req.body;
  user.findOneAndUpdate(
    { _id: mentor },
    { $push: { followers: student } },
    function (error, success) {
      if (error) {
        res.status(400).send({ message: error });
      } else {
        user.findOneAndUpdate(
          { _id: student },
          {
            $push: { following: mentor },
          },
          function (error, success) {
            if (error) {
              res.status(400).send({ message: error });
            } else {
              res.status(200).send({ message: "success" });
            }
          }
        );
      }
    }
  );
});

router.post("/unfollow", function (req, res, next) {
  const { student, mentor } = req.body;
  user.findOneAndUpdate(
    { _id: mentor },
    { $pull: { followers: student } },
    function (error, success) {
      if (error) {
        res.status(400).send({ message: error });
      } else {
        user.findOneAndUpdate(
          { _id: student },
          {
            $pull: { following: mentor },
          },
          function (error, success) {
            if (error) {
              res.status(400).send({ message: error });
            } else {
              res.status(200).send({ message: "success" });
            }
          }
        );
      }
    }
  );
});

router.get("/:id", function (req, res, next) {
  id = req.params.id;
  console.log(id);
  User.findById(id, (err, data) => {
    console.log(data);
    res.send(data);
  });
});

router.put("/:id", function (req, res, next) {
  id = req.params.id;
  const { firstName, lastName, phone, bio, skills } = req.body;
  User.findByIdAndUpdate(
    id,
    { firstName, lastName, phone, bio, skills },
    (err, data) => {
      if (err) res.status(400).json({ message: err });
      else res.status(200).json({ message: "data updated" });
    }
  );
});

router.delete("/:id", function (req, res, next) {
  id = req.params.id;
  User.findByIdAndDelete(id, (err, data) => {
    res.send("data deleted" + data);
  });
});

router.post("/login", (req, res, next) => {
  try {
    user.findOne({ email: req.body.email }).then((user) => {
      if (!user) {
        res.status(400).json({ message: req.body.email });
      } else {
        bcrypt.compare(req.body.password, user.password).then((isMatch) => {
          if (!isMatch) {
            res.status(400).json({ message: "incorrect password" });
          } else if (!user.verified) {
            res.status(400).json({ message: "Please confirm your email" });
          } else {
            var token = jwt.sign(
              {
                id: user._id,
                firstName: user.firstName,
                email: user.email,
                role: user.role,
              },
              process.env.PRIVATE_KEY,
              { expiresIn: "24h" }
            );
            res.status(200).json({
              accessToken: token,
              user: user,
            });
          }
        });
      }
    });
  } catch (error) {
    res.status(404).json(error.message);
  }
});

router.post("/upload-photo", upload.single("photo"), async (req, res) => {
  const photo = req.file.filename;
  const oldUser = await User.findById(req.body.id);
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.body.id },
    { photo }
  );
  if (!updatedUser) {
    return res.status(400).json({ message: "user does not exist" });
  }
  fs.unlink(`images/${oldUser.photo}`, () => console.log("success"));
  return res.status(200).json(photo);
});

router.post("/active", function (req, res, next) {
  let payload = null;
  try {
    payload = jwt.verify(
      req.body.token,
      process.env.USER_VERIFICATION_TOKEN_SECRET
    );
    User.findOneAndUpdate(
      { _id: payload.ID },
      { verified: true },
      (err, data) => {
        res.status(200).send("user verified");
      }
    );
  } catch (err) {
    return res.status(500).send(err);
  }
});

router.post("/resetpassword", function (req, res, next) {
  const email = req.body.email;

  User.findOne({ email: email }).then((user) => {
    console.log(req.body);
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    } else {
      const restpassword = uuidv4();
      user.restpassword = restpassword;
      user.save();
      mailer.ChangePassword(user.email, user.restpassword);
      return res.status(200).json({ message: "email send" });
    }
  });
});

router.post("/verify-restpassword", function (req, res, next) {
  const restpassword = req.body.restpassword;

  User.findOne({ restpassword: restpassword }).then((user) => {
    if (!user) {
      return res.status(400).json({ message: "user not found " });
    }

    user.restpassword = "";
    user.save();
    res.send({ id: user.id });
  });
});

router.post("/update-password", function (req, res, next) {
  const { id, password } = req.body;
  const hash = bcrypt.hashSync(password, 10); //hashed password

  User.findByIdAndUpdate({ _id: id }, { password: hash }).exec();

  res.status(200).json({ message: "password changed" });
});

router.get(
  "/a",
  passport.authenticate("jwt", { session: false }),
  inRole(ROLES.ADMIN),
  function (req, res, next) {
    User.find({}, function (err, users) {
      res.send(users);
    });
  }
);

module.exports = router;
