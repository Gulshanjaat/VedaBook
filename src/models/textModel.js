const mongoose = require("mongoose");

const textSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);



const textModel=mongoose.model("Text",textSchema)
module.exports=textModel
