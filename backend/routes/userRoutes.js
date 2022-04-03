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
let path = require("path");
const { findOneAndUpdate } = require("../models/user");

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
  firstName = req.body.firstName;
  User.findByIdAndUpdate(id, { firstName: firstName }, (err, data) => {
    res.send("data updated");
  });
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
  console.log("here");
  const photo = req.file.filename;
  console.log(req.body.id);
  console.log(photo);
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.body.id },
    { photo }
  );
  if (!updatedUser) {
    return res.status(400).json({ message: "user does not exist" });
  }
  return res.status(200).json({ message: "test" });
});

router.post("/active", function (req, res, next) {
  let payload = null;
  try {
    payload = jwt.verify(
      req.body.token,
      process.env.USER_VERIFICATION_TOKEN_SECRET
    );
    console.log(payload.ID);
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
