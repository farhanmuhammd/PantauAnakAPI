import TeacherProfile from '../models/teacher_profile.model.js';
import User from '../models/user.model.js';
import { generateDefaultCredential } from '../utils/credential.js';
import { NotFoundError } from '../utils/errors.js';
import { getPagination, buildPaginatedResponse } from '../utils/pagination.js';

export const createTeacherProfile = async (data) => {
    const { fullName, ...rest } = data;
    const { username, email, password } = generateDefaultCredential(fullName);

    let user = null;

    try {
        user = await User.create({ username: fullName, email, password, role: 'teacher' });

        const profile = await TeacherProfile.create({
            userId: user._id,
            fullName,
            ...rest,
        });

        return {
            credentials: { username, email, password },
            profile: await profile.populate('userId', 'email role'),
        };
    } catch (err) {
        if (user?._id) await User.findByIdAndDelete(user._id);
        throw err;
    }
};

export const getMyTeacherProfile = async (userId) => {
    const profile = await TeacherProfile.findOne({ userId }).populate('userId', 'email role');
    if (!profile) throw new NotFoundError('Teacher profile not found');
    return profile;
};

export const getAllTeacherProfiles = async (query) => {
    const { page, limit, skip } = getPagination(query);
    const [profiles, total] = await Promise.all([
        TeacherProfile.find().populate('userId', 'email role').skip(skip).limit(limit),
        TeacherProfile.countDocuments(),
    ]);
    return buildPaginatedResponse(profiles, total, page, limit);
};

export const getTeacherProfileById = async (id) => {
    const profile = await TeacherProfile.findById(id).populate('userId', 'email role');
    if (!profile) throw new NotFoundError('Teacher profile not found');
    return profile;
};

export const updateTeacherProfileById = async (id, data) => {
    const profile = await TeacherProfile.findOneAndUpdate(
        { _id: id },
        { $set: data },
        { new: true, runValidators: true }
    ).populate('userId', 'email role');
    if (!profile) throw new NotFoundError('Teacher profile not found');
    return profile;
};

export const updateTeacherProfile = async (userId, data) => {
    const profile = await TeacherProfile.findOneAndUpdate(
        { userId },
        { $set: data },
        { new: true, runValidators: true }
    ).populate('userId', 'email role');
    if (!profile) throw new NotFoundError('Teacher profile not found');
    return profile;
};

export const deleteTeacherProfile = async (id) => {
    const profile = await TeacherProfile.findById(id).populate('userId');
    if (!profile) throw new NotFoundError('Teacher profile not found');
    await User.findOneAndDelete({ _id: profile.userId._id });
};