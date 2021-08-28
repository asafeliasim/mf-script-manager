const express = require('express');
const path = require('path');
const multer = require('multer');
const router = express.Router();

const storage = multer.diskStorage({
    destination(req,file,cb){
        cb(null,'uploads/')
    },
    filename(req,file,cb){
        cb(null,`${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
    
})
function checkFileType(file,cb){
    const fileTypes = /zip|pdf/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = fileTypes.test(file.mimetype);
    if (extname && mimetype){
        return cb(null,true);
    }else{
        cb('Zip and Pdf only')
    }


} 
const upload = multer({
    storage,
    fileFilter:function(req,file,cb){
        checkFileType(file,cb);
    }
})

router.post('/', upload.single('file'),(req,res)=> {
    res.send(`/${req.file.path}`);
})
module.exports = router;