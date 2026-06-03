
const bcrypt = require("bcryptjs");
// const users = require("../../models/Usersmodel/users");
const jwt = require("jsonwebtoken");
const usermodel = require("../../models/users")
const imagekit = require("../../config/imagekit");
const sendmail = require("../../utils/mailer");






const registerUser = async (req, res) => {
  try {
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

    res.json({
      message: "User Registered Successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profilePic: user.profilePic,
      },
    });

  } catch (error) {
    res.json({ message: error.message });
  }
};



const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;


    if (!email || !password) {
      return res.json({ message: "Email and Password required" });
    }


    const user = await usermodel.findOne({ email });

    if (!user) {
      return res.json({ message: "Invalid Email or Password" });
    }


    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ message: "Invalid Email or Password" });
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );


    res.json({
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.json({ message: error.message });
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





module.exports = { registerUser, loginUser, forgotPassword, verifyOtp, resetPassword  };