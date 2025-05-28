const Newsletter = require("../models/Newsletter");
const nodemailer = require("nodemailer");

// Subscribe user to newsletter
exports.subscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const existing = await Newsletter.findOne({ email });
    if (existing) return res.status(409).json({ message: "Email already subscribed" });

    const subscriber = new Newsletter({ email });
    await subscriber.save();

    res.status(201).json({ 
      success: true,
      message: "Subscribed successfully" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Subscription failed", 
      error: err.message 
    });
  }
};

// Unsubscribe user
exports.unsubscribe = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const deleted = await Newsletter.findOneAndDelete({ email });
    if (!deleted) return res.status(404).json({ message: "Email not found" });

    res.json({ 
      success: true,
      message: "Unsubscribed successfully" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Unsubscribe failed", 
      error: err.message 
    });
  }
};

// Admin: send newsletter to all subscribers
exports.sendNewsletter = async (req, res) => {
  try {
    const { subject, content } = req.body;
    if (!subject || !content) 
      return res.status(400).json({ message: "Subject and content required" });

    const subscribers = await Newsletter.find();

    if (!subscribers.length) 
      return res.status(400).json({ message: "No subscribers found" });

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false, // true for 465
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const sendPromises = subscribers.map(subscriber => {
      return transporter.sendMail({
        from: process.env.SMTP_EMAIL,
        to: subscriber.email,
        subject,
        html: content,
      });
    });

    await Promise.all(sendPromises);

    res.json({ 
      success: true,
      message: "Newsletter sent to all subscribers" 
    });
  } catch (err) {
    res.status(500).json({ 
      success: false,
      message: "Failed to send newsletter", 
      error: err.message 
    });
  }
};
  

