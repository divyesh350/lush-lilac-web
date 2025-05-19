const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendEmail(to, subject, text, attachments = []) {
  const mailOptions = {
    from: `"Lush Lilac" <${process.env.SMTP_EMAIL}>`,
    to,
    subject,
    text,
    attachments, // Accepts array of { filename, content }
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
