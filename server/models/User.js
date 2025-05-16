const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["admin", "customer"],
      default: "customer",
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);
// 🔒 Pre-save password hashing
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔍 Compare passwords
userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};
module.exports = mongoose.model("User", userSchema);
