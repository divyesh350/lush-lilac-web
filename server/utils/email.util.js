const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

async function sendEmail(to, subject, text, attachments = [], html) {
  const mailOptions = {
    from: `"Lush Lilac" <no-reply@lushlilac.com>`,
    to,
    subject,
    text,
    attachments, // Accepts array of { filename, content }
    html, // Add the html body here
  };

  await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;
