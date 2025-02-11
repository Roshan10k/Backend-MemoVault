const multer = require('multer')
const path = require('path')


//configure storage
const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,'uploads/'); //Directory where files will be stored
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`); //Ensure unique filenames

    },
});

//file filter to allow only images
const fileFilter = (req,file,cb)=>{
    if(file.mimetype.startsWith('image/')){
        cb(null,true); //Accept file
    }else{
        cb(new Error('only image files are allowed!'),false); //Reject file
    }
};

//Set up multer
const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;


