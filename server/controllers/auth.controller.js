const User = require("../models/User");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require("../utils/jwt.util");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const role = req.body.role || "customer";
    const userExists = await User.findOne({ email });
    if (userExists)
      return res
        .status(409)
        .json({ message: "Email already in use", success: false });

    const user = new User({ name, email, password, role });
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;

    await user.save();

    const accessToken = generateAccessToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      message: "User registered successfully",
      success: true,
    });
  } catch (err) {
    res.status(500).json({
      message: "Registration failed",
      error: err.message,
      success: false,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res
        .status(401)
        .json({ message: "Invalid email or password", success: false });

    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    const accessToken = generateAccessToken(user);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      message: "User logged in successfully",
      success: true,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Login failed", error: err.message, success: false });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    res.clearCookie("refreshToken");

    if (token) {
      await User.findOneAndUpdate(
        { refreshToken: token },
        { refreshToken: "" }
      );
    }

    res.status(200).json({ message: "Logged out successfully", success: true });
  } catch (err) {
    res.status(500).json({ message: "Logout failed", success: false });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: "No refresh token" });

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) {
      return res.status(403).json({ message: "Forbidden or token mismatch" });
    }

    // Generate new access and refresh tokens
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    // Save the new refresh token in DB
    user.refreshToken = newRefreshToken;
    await user.save();

    // Set new refresh token in HTTP-only cookie
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Refresh token error:", err);
    res.status(403).json({ message: "Invalid or expired refresh token" });
  }
};

exports.checkAuth = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    // If no refresh token, user is not authenticated
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token" });
    }

    // Verify the refresh token
    const decoded = verifyRefreshToken(refreshToken);
    if (!decoded) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    // Find user and verify refresh token matches
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(401)
        .json({ message: "Invalid user or token mismatch" });
    }

    // Generate new access token
    const accessToken = generateAccessToken(user);

    // Return user data and new access token
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
    });
  } catch (err) {
    console.error("Auth check error:", err);
    res.status(401).json({ message: "Authentication check failed" });
  }
};
