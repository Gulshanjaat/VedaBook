
const bcrypt = require("bcryptjs");
// const users = require("../../models/Usersmodel/users");
const jwt = require("jsonwebtoken");
const usermodel = require("../../models/users")
const imagekit = require("../../config/imagekit");
const sendmail = require("../../utils/mailer");






const registerUser = async (req, res) => {
  try {

     console.log("Headers:", req.headers["content-type"]);

      console.log("Body:", req.body);

      if (!req.body) {
      return res.status(400).json({
        success: false,
        message: "req.body is undefined",
      });
    }

    
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ message: "All fields required" });
    }

    const userExist = await usermodel.findOne({ email });

    if (userExist) {
      return res.json({ message: "User already exists" });
    }


    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let imageUrl = "";


    if (req.file) {
      const uploadedImage = await imagekit.upload({
        file: req.file.buffer,
        fileName: Date.now() + "-" + req.file.originalname,
        folder: "/users",
      });

      imageUrl = uploadedImage.url;
    }


    const user = await usermodel.create({
      name,
      email,
      password: hashedPassword,
      profilePic: imageUrl,
    });
   

   const token = jwt.sign(
  {
    id: user._id,
    isAdmin: user.isAdmin,
  },
  process.env.JWT_SECRET,
  {
    expiresIn: "7d",
  }
);

return res.status(201).json({
  success: true,
  message: "User Registered Successfully",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
    tokens: user.tokens,
  },
});

  } catch (error) {

  console.log("Register Error:", error);

  res.status(500).json({
    success: false,
    message: error.message,
  });

}
};



const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and Password required",
      });
    }

    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );
   
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({

      success: true,

      message: "Login Successful",

      token,

      user: {

        id: user._id,

        name: user.name,

        email: user.email,

        tokens: user.tokens,

      },

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,

      message: error.message,

    });

  }
};

const updateUser = async (req, res) => {

  try {

    const { userId, name } = req.body;

    const user =
      await usermodel.findById(userId);

    if (!user) {

      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name) {
      user.name = name;
    }

    await user.save();

    res.json({
      success: true,
      message:
        "Profile updated successfully",

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic:
          user.profilePic,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};




const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.json({ message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;

    await user.save();


    await sendmail(email, `Your OTP is ${otp}`);

    res.json({ message: "OTP sent successfully" });

  } catch (error) {
    res.json({ message: error.message });
  }
};


const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await usermodel.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpire < Date.now()) {
      return res.json({ message: "Invalid or expired OTP" });
    }

    res.json({ message: "OTP verified" });

  } catch (error) {
    res.json({ message: error.message });
  }
};


const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await usermodel.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    user.otp = null;
    user.otpExpire = null;

    await user.save();

    res.json({ message: "Password reset successful" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const logoutUser = async (req, res) => {

  try {

    res.json({
      success: true,
      message: "Logout successful",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};





module.exports = { registerUser, loginUser, updateUser, forgotPassword, verifyOtp, resetPassword, logoutUser };