const mongoose =
require("mongoose");

const pdfSchema =
new mongoose.Schema({

fileName:{

type:String,

required:true,

},

pdfUrl:{

type:String,

required:true,

},

extractedText:{

type:String,

required:true,

},

imagekitFileId:{

type:String,

required:true,

},

fileSize:{

type:Number,

default:0,

},

userId:{

type:mongoose.Schema.Types.ObjectId,

ref:"User",

required:true,

},

isDeleted:{

type:Boolean,

default:false,

},

},

{

timestamps:true,

});

module.exports=
mongoose.model(

"PDF",

pdfSchema

);