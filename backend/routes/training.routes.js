const express = require("express");

const router = express.Router();

const trainingModule = require("../models/training");
//GET ALL
router.get("/getAll", async (req, res) => {
  try {
    const data = await trainingModule.find();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//GET ONE BY ID
router.get("/getOne/:id", async (req, res) => {
  try {
    const data = await trainingModule.findById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//POST API
router.post("/insert", async (req, res) => {
  const data = new trainingModule({
    name: req.body.name,
    description: req.body.description,
    tag: req.body.tag,
    creationDate: new Date(),
    duration: req.body.duration,
    language: req.body.language,
    scheduledDate: req.body.scheduledDate,
  });
  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//PATCH API
router.patch("/patch/:id", async (req, res) => {
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
router.delete("/delete/:id", async (req, res) => {
  try {
    await trainingModule.findByIdAndDelete(req.params.id);
    res.send(`${req.params.id} has been Deleted`);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = router;
