const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
});

async function sendEmail(toEmail, subject, text) {
  try {
    const info = await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: toEmail,
      subject: subject,
      text: text,
    });
    console.log("Message ID:", info.messageId);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
  }
}

module.exports = sendEmail;
