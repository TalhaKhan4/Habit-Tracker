const nodemailer = require("nodemailer");
const dns = require("dns");

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
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
