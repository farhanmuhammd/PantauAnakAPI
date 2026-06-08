import User from '../models/user.model.js';
import { signAccessToken, signRefreshToken } from '../utils/token.js';
import { UnauthorizedError } from '../utils/errors.js';

export const registerUser = async (data) => {
  const user = await User.create(data);
  return user;
};

export const loginUser = async (username, password) => {
  const user = await User.findOne({ username }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new UnauthorizedError('Invalid username or password');
  }

  const payload = { id: user._id, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.refreshToken;

  return { accessToken, refreshToken, user: userObj };
};

export const refreshAccessToken = async (token) => {
  const user = await User.findOne({ refreshToken: token }).select('+refreshToken');
  if (!user) throw new UnauthorizedError('Invalid refresh token');

  const payload = { id: user._id, role: user.role };
  const newAccessToken = signAccessToken(payload);
  const newRefreshToken = signRefreshToken(payload);

  user.refreshToken = newRefreshToken;
  await user.save();

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

export const logoutUser = async (userId) => {
  await User.findByIdAndUpdate(userId, { refreshToken: null });
};
