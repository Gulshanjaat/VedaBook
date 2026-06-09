const express = require("express");
const { registerUser, loginUser, forgotPassword, verifyOtp, resetPassword, uploadProfile, updateUser, logoutUser } = require("../../controllers/Users/usercontrollers");
const upload = require("../../utils/multer");
const router = express.Router();


router.post(
  "/register",
  upload.single("profilePic"),
  registerUser
);

router.post("/login", loginUser)

router.put(
  "/update",

  upload.single("profilePic"),

  updateUser
);

router.post("/forgetpassword", forgotPassword)

router.post("/veryfyotp", verifyOtp)

router.post("/resetpassword", resetPassword)

router.post("/logout", logoutUser);



module.exports = router; 