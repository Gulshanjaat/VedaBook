const Message =
require("../models/messageModel");



const saveUserMessage =
async (

    conversationId,

    content

)=>{

    return await Message.create({

        conversationId,

        role:"user",

        content,

    });

};


const saveAIMessage =
async(

    conversationId,

    content,

    sourcePDFs=[],

    sourceTexts=[],

    tokensUsed=0,

)=>{

    return await Message.create({

        conversationId,

        role:"assistant",

        content,

        sourcePDFs,

        sourceTexts,

        tokensUsed,

    });

};

const getMessages = async (req, res) => {

  try {

    const { conversationId } = req.params;

    const messages =
      await messageService.getMessages(
        conversationId
      );

    res.status(200).json({

      success: true,

      messages,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: error.message,

    });

  }

};



const latestMessage =
async(

conversationId

)=>{

return await Message.findOne({

conversationId,

isDeleted:false,

})

.sort({

createdAt:-1,

});

};

const deleteMessages =
async(

conversationId

)=>{

return await Message.updateMany(

{

conversationId,

},

{

isDeleted:true,

}

);

};


module.exports={

saveUserMessage,

saveAIMessage,

getMessages,

latestMessage,

deleteMessages,

};