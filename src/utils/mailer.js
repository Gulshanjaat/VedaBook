const mailer = require("nodemailer");

const transporter = mailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const sendmail = async (to, text) => {
  try {
    await transporter.sendMail({
      from: "gulshansepat2228@gmail.com",
      to: to,
      subject: "Password Reset OTP",
      text: text,
    });

    console.log("mail send successfully");
  } catch (error) {
    console.log("error occurred", error);
  }
};

module.exports = sendmail;