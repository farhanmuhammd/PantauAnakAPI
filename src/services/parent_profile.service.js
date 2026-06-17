import ParentProfile from '../models/parent_profile.model.js';
import User from '../models/user.model.js';
import { generateDefaultCredential } from '../utils/credential.js';
import { NotFoundError } from '../utils/errors.js';
import { getPagination, buildPaginatedResponse } from '../utils/pagination.js';

export const createParentProfile = async ({ children, parents, address }) => {
    const firstParent = parents?.[0];
    if (!firstParent?.fullName) throw new Error('At least one parent with fullName is required');

    const { username, email, password } = generateDefaultCredential(firstParent.fullName);

    let user = null;

    try {
        user = await User.create({ username: firstParent.fullName, email, password, role: 'user' });

        const profile = await ParentProfile.create({
            userId: user._id,
            children,
            parents,
            address,
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

export const getMyParentProfile = async (userId) => {
    const profile = await ParentProfile.findOne({ userId }).populate('userId', 'email role');
    if (!profile) throw new NotFoundError('Parent profile not found');
    return profile;
};

export const getAllParentProfiles = async (query) => {
    const { page, limit, skip } = getPagination(query);
    const [profiles, total] = await Promise.all([
        ParentProfile.find().populate('userId', 'email role').skip(skip).limit(limit),
        ParentProfile.countDocuments(),
    ]);
    return buildPaginatedResponse(profiles, total, page, limit);
};

export const getParentProfileById = async (id) => {
    const profile = await ParentProfile.findById(id).populate('userId', 'email role');
    if (!profile) throw new NotFoundError('Parent profile not found');
    return profile;
};

export const updateProfileById = async (id, data) => {
    const profile = await ParentProfile.findOneAndUpdate(
        { _id: id },
        { $set: data },
        { new: true, runValidators: true }
    ).populate('userId', 'email role');
    if (!profile) throw new NotFoundError('Parent profile not found');
    return profile;
};

export const updateMyParentProfile = async (userId, data) => {
    const profile = await ParentProfile.findOneAndUpdate(
        { userId },
        { $set: data },
        { new: true, runValidators: true }
    ).populate('userId', 'email role');
    if (!profile) throw new NotFoundError('Parent profile not found');
    return profile;
};

export const deleteParentProfile = async (id) => {
    const profile = await ParentProfile.findById(id).populate('userId');
    if (!profile) throw new NotFoundError('Parent profile not found');
    await User.findOneAndDelete({ _id: profile.userId._id });
};