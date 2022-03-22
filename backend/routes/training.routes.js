const express = require("express");

const multer = require("multer");

const path = require("path");

const router = express.Router();
const trainingModule = require("../models/training");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: "1000000" },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimeType = fileTypes.test(file.mimetype);
    const extname = fileTypes.test(path.extname(file.originalname));

    if (mimeType && extname) {
      return cb(null, true);
    }
    cb("Give proper files formate to upload");
  },
}).single("image");

//GET ALL
router.get("/training/getAll", async (req, res) => {
  try {
    const data = await trainingModule.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET ONE BY ID
router.get("/training/getOne/:id", async (req, res) => {
  try {
    const data = await trainingModule.findById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//POST API
router.post("/training/insert", upload, async (req, res) => {
  const data = new trainingModule({
    name: req.body.name,
    description: req.body.description,
    tag: req.body.tag,
    creationDate: new Date(),
    duration: req.body.duration,
    language: req.body.language,
    scheduledDate: req.body.scheduledDate,
    nbrParticipent: req.body.nbrParticipent,
    image: req.file.path,
  });
  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//PATCH API
router.patch("/training/patch/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const dataToUpdate = req.body;
    const options = { new: true };

    const result = await trainingModule.findByIdAndUpdate(
      id,
      dataToUpdate,
      options
    );
    res.send(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//DELET API
router.delete("/training/delete/:id", async (req, res) => {
  try {
    await trainingModule.findByIdAndDelete(req.params.id);
    res.send(`${req.params.id} has been Deleted`);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = router;
