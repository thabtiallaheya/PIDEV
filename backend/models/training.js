const mongoose = require("mongoose");
const TrainingSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tag: {
    type: String,
    required: true,
  },
  creationDate: {
    type: Date,
  },
  duration: {
    type: Number,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  scheduledDate: {
    type: Date,
  },
  nbrParticipent: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
});
const Training = mongoose.model("training", TrainingSchema);
module.exports = Training;
