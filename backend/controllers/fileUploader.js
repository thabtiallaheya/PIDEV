"use strict";
const https = require("https");
const singleFile = require("../models/SingleFile");
const MultipleFile = require("../models/MutipleFile");
const SingleFile = require("../models/SingleFile");
const singleFileUpload = async (req, res, next) => {
  try {
    const file = new singleFile({
      fileName: req.file.originalname,
      filePath: req.file.path,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatter(req.file.size, 2),
    });
    await file.save();
    console.log(file);
    res.status(201).send("File uploaded successfuly ");
  } catch (error) {
    res.status(400).send(error.message);
  }
};
const multipleFileUpload = async (req, res, next) => {
  try {
    let filesArray = [];

    req.files.forEach((element) => {
      const file = {
        fileName: element.filename,
        filePath: element.path,
        fileType: element.mimetype,
        fileSize: fileSizeFormatter(element.size, 2),
      };
      filesArray.push(file);
    });

    const multipleFiles = new MultipleFile({
      subject: req.body.subject,
      title: req.body.title,
      file: filesArray,
      limiteDate: req.body.limiteDate,
    });
    await multipleFiles.save();
    res.status(201).send("Files uploaded successfuly");
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const getallMultipleFiles = async (req, res, next) => {
  try {
    const files = await MultipleFile.find();
    res.status(200).send(files);
  } catch (error) {
    res.status(200).send(error.message);
  }
};

const getMultipleFilesById = async (req, res) => {
  const id = req.params.id;
  MultipleFile.findById(id, function (err, activity) {
    if (err) return res.json({ sucess: false, error: err });

    return res.json({ sucess: true, activity });
  });
};

/*const downloadFilesById = async (req, res) => {
  /*const id = req.params.id
  const activity = MultipleFile.findById(id)
  if (!activity) {
    return res.status(404).json({ message: 'activity does not exist' })
  }
  https.get(activity.file, (fileStream) => {
    fileStream.pipe(res)
  })
  const id = req.params.id
  MultipleFile.findById(id, function (err, activity) {
    if (err) return res.json({ sucess: false, error: err })

    return res.json({ sucess: true, activity })
  })
}*/

const deleteFilesById = async (req, res) => {
  const id = req.params.id;
  await MultipleFile.findByIdAndRemove(id).exec();
  res.send("deleted");
};
//app.put('/update/:id',
const updateFilesById = async (req, res) => {
  MultipleFile.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    (err, post) => {
      if (err) return res.status(400).json({ sucess: false, err });
      return res.status(200).json({ sucess: true });
    }
  );
};

const Fs = require("fs");
const Path = require("path");
const { Http2ServerRequest, Http2ServerResponse } = require("http2");

const fileSizeFormatter = (bytes, decimal) => {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const dm = decimal || 2;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "YB", "ZB"];
  const index = Math.floor(Math.log(bytes) / Math.log(1000));
  return (
    parseFloat((bytes / Math.pow(1000, index)).toFixed(dm)) + "-" + sizes[index]
  );
};
module.exports = {
  singleFileUpload,
  multipleFileUpload,
  getallMultipleFiles,
  getMultipleFilesById,
  deleteFilesById,
  updateFilesById,
  //downloadFilesById,
};
