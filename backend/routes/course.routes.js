const express = require("express");

const multer = require("multer");

const path = require("path");
const cloudinary = require("../cloudinary");
const uuid=require('uuid').v4;
const courseModule = require("../models/course");

const files=[];
const fileInArray=[];
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null,"uploads")
  },
    filename:(req,file,cb)=>{
        let filePath=[];
        console.log("MULTER ENTRY ",file.originalname)
        console.log("files",req.files)
        
        const ext = path.extname(file.originalname);
        const id = uuid();
        filePath = `${id}${ext}`;
        fileInArray.push([(filePath)])  
        console.log("IN ARRAY ",filePath)        
        files.push(fileInArray)
        console.log("PUSHED MAIN ARRAY", fileInArray)    
        cb(null,filePath)       
        console.log("current length",files.length)
    }
  })
  
  
  const upload=multer({
      
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "video/mp4" || file.mimetype == "application/pdf") {
          cb(null, true);
      } else {
          cb(null, false);
          return cb(new Error('Only .png, .jpg, .jpeg .mp4 and .pdf format allowed!'));
      }
  },
  storage:storage,
  })
    
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

//POST API
router.post("/course/insert", upload.array('uploaded_Image', 10), async (req, res) => {
    try {
   
      console.log(req.files.length)
       console.log("Files",fileInArray)
       let img;
       let vid;
       let pdff;
   
     for(let i=0;i<fileInArray.length;i++){
       let fileext = fileInArray[i][0].split('.')[1];
       console.log(path.resolve(__dirname, "../uploads"))
       if(fileext=='jpg' || fileext=='png' || fileext=='jpeg')
       img = await cloudinary.uploader.upload(`${path.resolve(__dirname, "../uploads")}/${fileInArray[i][0]}`);
       else if(fileext=="mp4")
       vid = await cloudinary.uploader.upload(`${path.resolve(__dirname, "../uploads")}/${fileInArray[i][0]}`,{ resource_type: "video" });
       else if(fileext=="pdf")
       pdff = await cloudinary.uploader.upload(`${path.resolve(__dirname, "../uploads")}/${fileInArray[i][0]}`,{ pages: true });
     }
   
      let data = new courseModule({
        name: req.body.name,
        description: req.body.description,
        tag: req.body.tag,
        image: img.secure_url,
        price: req.body.price,
        video : vid.secure_url,
        pdf : pdff.secure_url,
        cloudinary_id_img: img.public_id,
        cloudinary_id_vid: vid.public_id,
        cloudinary_id_pdf: pdff.public_id
      });
      
      await data.save();
      res.json(data);
    } catch (err) {
      console.log(err);
    }
  });
//PATCH API
router.patch("/course/patch/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const dataToUpdate = req.body;
    const options = { new: true };

    const result = await courseModule.findByIdAndUpdate(
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
router.delete("/course/delete/:id", async (req, res) => {
  try {
    await courseModule.findByIdAndDelete(req.params.id);
    res.send(`${req.params.id} has been Deleted`);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = router;
