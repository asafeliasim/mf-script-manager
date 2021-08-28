const express = require('express');
const asyncHandler = require('express-async-handler');

const router = express.Router();
const Script = require('../models/scriptModel');
const {getScripts,createScript,deleteScripts,downloadFiles,pagination} = require('../controllers/scriptController');

router.route('/').get(getScripts).post(createScript);

router.route('/delete').post(deleteScripts);
router.route('/download/:file').get(downloadFiles);
router.route('/pagination').get(pagination);
router.get('/:id',asyncHandler(async (req,res)=> {
    const script = await Script.findById(req.params.id);

    if(script){
        res.json(script);
    }else{
        res.status(404);
        throw new Error('Script not found!')
    }
}))




module.exports = router;

