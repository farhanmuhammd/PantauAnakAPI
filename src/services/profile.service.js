import mongoose from 'mongoose';
import Profile from '../models/profile.model.js';
import User from '../models/user.model.js';
import { NotFoundError } from '../utils/errors.js';
import { getPagination, buildPaginatedResponse } from '../utils/pagination.js';

const findProfileOrFail = async (query) => {
    const profile = await Profile.findOne(query).populate('userId', 'email role');
    if (!profile) throw new NotFoundError('Profile not found');
    return profile;
};

const generateDefaultCredential = (fullName) => {
    const sanitized = fullName.trim().toLowerCase().replace(/\s+/g, '.');
    const username = fullName.replace(/\s+/g, '').toLowerCase();
    const email = `${sanitized}@gmail.com`;
    const password = fullName.replace(/\s+/g, '').toLowerCase();
    return { username, email, password };
};

export const createProfile = async ({ children, parents, address }) => {
    // const session = await mongoose.startSession();
    // session.startTransaction();

    try {
        const firstParent = parents?.[0];
        if (!firstParent?.fullName) throw new Error('At least one parent with fullName is required');

        const { username, email, password } = generateDefaultCredential(firstParent.fullName);

        const [user] = await User.create([{ username, email, password }], /* { session } */ );

        const [profile] = await Profile.create(
            [{ userId: user._id, children, parents, address }],
            /* { session } */
        );

        await session.commitTransaction();

        return {
            credentials: { username, email, password },
            profile: await profile.populate('userId', 'email role'),
        };
    } catch (err) {
        if (user?._id) await User.findByIdAndDelete(user._id);
        // await session.abortTransaction();
        throw err;
    }
};

export const getMyProfile = async (userId) => {
    return findProfileOrFail({ userId });
};

export const getProfileById = async (id) => {
    return findProfileOrFail({ _id: id });
};

export const getAllProfiles = async (query) => {
    const { page, limit, skip } = getPagination(query);
    const [profiles, total] = await Promise.all([
        Profile.find().populate('userId', 'email role').skip(skip).limit(limit),
        Profile.countDocuments(),
    ]);
    return buildPaginatedResponse(profiles, total, page, limit);
};

export const updateProfile = async (id, data) => {
    const profile = await Profile.findOneAndUpdate(
        { _id: id },
        { $set: data },
        { new: true, runValidators: true }
    ).populate('userId', 'email role');

    if (!profile) throw new NotFoundError('Profile not found');
    return profile;
};

export const deleteProfile = async (id) => {
    const profile = await Profile.findOneAndDelete({ _id: id });
    if (!profile) throw new NotFoundError('Profile not found');
};