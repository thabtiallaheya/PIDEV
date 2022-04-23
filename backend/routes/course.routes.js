const router = require("express").Router();
const cloudinary = require("../cloudinary");
const multer  = require('multer')
const uuid=require('uuid').v4;
const path = require('path');
const courseModule = require("../models/course");
//const Course = require("../models/course");

const files=[];
const fileInArray=[]
const videoStorage = multer.diskStorage({
    destination: 'videos', // Destination to store video
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '_' + Date.now() + path.extname(file.originalname))
    }
});

const videoUpload = multer({
    storage: videoStorage,
    limits: {
        fileSize: 10000000   // 10000000 Bytes = 10 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(mp4|MPEG-4)$/)) {     // upload only mp4 and mkv format
            return cb(new Error('Please upload a Video'))
        }
        cb(undefined, true)
    }
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "course");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024*1024*50 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif|mp4|pdf/;
        const mimeType = fileTypes.test(file.mimetype);
        const extname = fileTypes.test(path.extname(file.originalname));

        if (mimeType && extname) {
            return cb(null, true);
        }
        cb("Give proper files formate to upload");
    },
}).single("image");
//POST API
//router.post("/course/ajout", imageUpload, async (req, res) => {

router.post("/course/add", upload, async (req, res) => {
    console.log("Files",fileInArray)
    let img;
    let vid;
    let pdff;

    for(let i=0;i<fileInArray.length;i++){
        let fileext = fileInArray[i][0].split('.')[1];
        console.log(path.resolve(__dirname, "../uploads"))
        if(fileext==='jpg' || fileext==='png' || fileext==='jpeg')
            img = await cloudinary.uploader.upload(`${path.resolve(__dirname, "../uploads")}/${fileInArray[i][0]}`);
        else if(fileext==="mp4")
            vid = await cloudinary.uploader.upload(`${path.resolve(__dirname, "../uploads")}/${fileInArray[i][0]}`,{ resource_type: "video" });
        else if(fileext==="pdf")
            pdff = await cloudinary.uploader.upload(`${path.resolve(__dirname, "../uploads")}/${fileInArray[i][0]}`,{ pages: true });
    }
    const data = new courseModule({
        name: req.body.name,
        description: req.body.description,
        tag: req.body.tag,
        image: req.body.img,
        video: req.body.vid,
        pdf: req.body.pdff,
        price: req.body.price,
        cloudinary_id_img: img.public_id,
        cloudinary_id_vid: vid.public_id,
        cloudinary_id_pdf: pdff.public_id,
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
