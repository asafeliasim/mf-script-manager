

const fs = require('fs');
const Script = require('../models/scriptModel');
const {convertFilePath} = require('../services/helpers');
const AdmZip = require('adm-zip');




const directory = process.cwd();



// @desc   Fetch all scripts
// @route  GET /api/scripts
// @access Public
const getScripts = async (req,res) => {
    try{
        const scripts = await Script.find({});
        if(!scripts){
            res.status(400).json({
                message:'There are not scripts'
            })
        }
        else{
            res.json(scripts);
        }
    }catch(error){
        res.json({
            message: 'Request faild with status 404, Something went wrong with the request, please try again later !!'
        })
    }
}


const pagination = async(req,res) => {
    try{
        const scripts = await Script.find({});
        
        if(!scripts){
            res.status(400).json({
                message:'There are not scripts'
            })
        }
        else{ 
            const {page,limit} = req.query;
            const pageNumber = Number(page)
            const limitNumber = Number(limit)
            const startIndex = (pageNumber - 1) * limitNumber;

            console.log(startIndex)
            const endIndex = pageNumber * limitNumber;
            console.log(endIndex)
            //  console.log(scripts.slice(req.query.page,req.query.limit));
            res.send(scripts.slice(startIndex,endIndex));
        }
    }catch(error){
        res.json({
            message: 'Request faild with status 404, Something went wrong with the request, please try again later !!'
        })
    }
}
// @desc   Create new Script
// @route  POST /api/scripts
// @access Public
const createScript = async (req,res) => {
    console.log(req.body);
    try{
        const {scriptName,description,userName,file} = req.body;
        const script =  new Script({
                scriptName,
                description,
                userName,
                file
        });
            await script.save();
            res.send(script);
        }catch(error){
            res.status(500).send(error.errors);
        }
}
// @desc   Delete script/scripts
// @route  POST /api/scripts/delete
// @access Public
const deleteScripts = async(req,res) => {
    let deleted = true;
    const idsSize = req.body.length;

    for(let i = 0 ; i < idsSize ; i++){
        const script = await Script.findByIdAndDelete(req.body[i]);
    
        if(!script){
            deleted = false;
        }
        if(script.file){
            const filePath = convertFilePath(script);
            fs.unlink(`${directory}/uploads/${filePath}`,(err)=> {
                if(err){
                    console.log(err);
                }else{
                    console.log('File deleted.')
                }
            })
            
        }
       
    }
    res.send(deleted);

}
// @desc   Download script file
// @route  GET /api/scripts/download
// @access Public
const downloadFiles = async (req,res) => {
   
   let zip;
    const files = req.params.file.split(',');
    if(files.length === 1){
        res.download(`${directory}/uploads/${req.params.file}`, req.params.file, (err) => {
            if (err) {
              res.status(500).send({
                message: "Could not download the file. " + err,
              });
            }
          });
    }else if(files.length > 1){
        zip = new AdmZip();
        files.forEach(file=> {
            zip.addLocalFile(`${directory}/uploads/${file}`);
        })   
        const downloadName = `downloadfile.zip`;
        const data = zip.toBuffer();
        // zip.writeZip(`${directory}/${downloadName}`);
        res.set('Content-Type','application/octet-stream');
        res.set('Content-Disposition',`attachment; filename=${downloadName}`);
        res.set('Content-Length',data.length);
        res.send(data);
    }else{
        console.log('Nothing to download.') 
        
    }
}
module.exports = {
    getScripts,
    createScript,
    deleteScripts,
    downloadFiles,
    pagination
}