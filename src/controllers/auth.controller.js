import * as authService from '../services/auth.service.js';
import { verifyRefreshToken } from '../utils/token.js';
import { UnauthorizedError } from '../utils/errors.js';
import { sendSuccess } from '../utils/response.js';

export const register = async (req, res, next) => {
  try {
    const user = await authService.registerUser(req.body);
    sendSuccess(res, { user }, 201);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { accessToken, refreshToken, user } = await authService.loginUser(
      req.body.username,
      req.body.password
    );
    sendSuccess(res, { user, accessToken, refreshToken });

  } catch (err) {
    next(err);
  }
};

export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const tokens = await authService.refreshAccessToken(refreshToken);
    sendSuccess(res, { accessToken: tokens.accessToken, refreshToken: tokens.refreshToken });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res, next) => {
  try {
    await authService.logoutUser(req.user._id);
    sendSuccess(res, { message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

export const me = (req, res) => {
  sendSuccess(res, { user: req.user });
};
