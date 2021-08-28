const mongoose = require('mongoose');

const scriptSchema = mongoose.Schema({
    scriptName: {
        type:String,
        required: true,
        minlength:2
    },
    description:{
        type:String,
        required:true,
        minlength:5
    },
    userName: {
        type:String,
        required:true,
        minlength:2
    },
    file:{
        type:String
    }
},{
   timestamps:true
})
const Script = mongoose.model('Script',scriptSchema);
module.exports = Script;