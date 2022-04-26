const router = require("express").Router();
const multer = require('multer')
const uuid = require('uuid').v4;
const path = require('path');
const courseModule = require("../models/course");
//const Course = require("../models/course");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "course");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },
});
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 50 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif|mp4|pdf/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give proper files formate to upload");
  },
}).array("image");
//POST API
//router.post("/course/ajout", imageUpload, async (req, res) => {

router.post("/course/add", upload, async (req, res) => {
  console.log("Files", req.files)

  const data = new courseModule({
    name: req.body.name,
    description: req.body.description,
    tag: req.body.tag,
    files: req.files.map(file => file.path),
    price: req.body.price
  });
  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


//GET ALL
router.get("/course/getAll", async (req, res) => {
  try {
    const data = await courseModule.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET ONE BY ID
router.get("/course/getOne/:id", async (req, res) => {
  try {
    const data = await courseModule.findById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


//PATCH API
router.patch("/course/patch/:id", upload, async (req, res) => {
  try {
    const id = req.params.id;
    const { price, name, description, tag } = req.body;
    const options = { new: true };

    const result = await courseModule.findByIdAndUpdate(
      id,
      {
        price,
        name,
        description,
        tag,
      },
      options
    );

    if (req.files.length > 0) {
      await courseModule.findByIdAndUpdate(
        id,
        {
          files: req.files.map(file => file.path),
        },
        options
      );
    }

    res.send(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//DELET API
router.delete("/course/delete/:id", async (req, res) => {
  try {
    await courseModule.findByIdAndDelete(req.params.id);
    res.send(`${req.params.id} has been Deleted`);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = router;
