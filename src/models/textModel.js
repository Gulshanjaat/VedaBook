const mongoose = require("mongoose");

const textSchema =
new mongoose.Schema({

title:{

type:String,

required:true,

},

content:{

type:String,

required:true,

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

"Text",

textSchema

);