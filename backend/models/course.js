const mongoose = require("mongoose");
const CourseSchema = new mongoose.Schema({
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

  price: {
    type: Number,
  },
  files: {
    type: Array
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const Course = mongoose.model("course", CourseSchema);
module.exports = Course;
