import User from '../models/user.model.js';
import { NotFoundError } from '../utils/errors.js';
import { getPagination, buildPaginatedResponse } from '../utils/pagination.js';

export const getAllUsers = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const [users, total] = await Promise.all([
    User.find().skip(skip).limit(limit),
    User.countDocuments(),
  ]);
  return buildPaginatedResponse(users, total, page, limit);
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) throw new NotFoundError('User not found');
  return user;
};

export const createUser = async (data) => {
  return User.create(data);
};

export const updateUser = async (id, data) => {
  const user = await User.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  if (!user) throw new NotFoundError('User not found');
  return user;
};

export const deleteUser = async (id) => {
  const user = await User.findByIdAndDelete(id);
  if (!user) throw new NotFoundError('User not found');
};
