const User = require("../models/users");


const checkTokens = async (userId) => {

    const user =
        await User.findById(userId);

    if (!user) {

        throw new Error("User not found");

    }

    if (user.tokens <= 0) {

        throw new Error(
            "No tokens left. Please subscribe."
        );

    }

    return user;

};

const deductToken = async (userId) => {

    const user =
        await User.findById(userId);

    user.tokens -= 1;

    await user.save();

    return user.tokens;

};


const addTokens = async (

userId,

tokens

)=>{

const user =
await User.findById(userId);

user.tokens += tokens;

await user.save();

return user.tokens;

};

const getRemainingTokens =
async(userId)=>{

const user=
await User.findById(userId);

return user.tokens;

};

module.exports={

checkTokens,

deductToken,

addTokens,

getRemainingTokens,

}; 