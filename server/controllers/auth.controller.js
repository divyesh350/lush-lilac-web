const User = require('../models/User');
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwt.util');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = new User({ name, email, password });
    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;

    await user.save();

    const accessToken = generateAccessToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'Invalid email or password' });

    const refreshToken = generateRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();

    const accessToken = generateAccessToken(user);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      accessToken,
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    res.clearCookie('refreshToken');

    if (token) {
      await User.findOneAndUpdate({ refreshToken: token }, { refreshToken: '' });
    }

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Logout failed' });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (!token) return res.status(401).json({ message: 'No refresh token' });

    const decoded = verifyRefreshToken(token);
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== token) return res.status(403).json({ message: 'Forbidden' });

    const newAccessToken = generateAccessToken(user);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: 'Invalid or expired refresh token' });
  }
};
