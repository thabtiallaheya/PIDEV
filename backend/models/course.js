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
  image: {
    type: String,
  },
  video: {
    type: String,
  },
  pdf : {
    type: String,
  },
  cloudinary_id_img: {
    type: String,
  },
  cloudinary_id_vid: {
    type: String,
  },
  cloudinary_id_pdf: {
    type: String,
  }
});
const Course = mongoose.model("course", CourseSchema);
module.exports = Course;
