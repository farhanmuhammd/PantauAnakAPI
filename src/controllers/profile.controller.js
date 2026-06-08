import * as profileService from '../services/profile.service.js';
import { sendSuccess } from '../utils/response.js';

export const getMyProfile = async (req, res, next) => {
    try {
        const profile = await profileService.getMyProfile(req.user._id);
        sendSuccess(res, { profile });
    } catch (err) {
        next(err);
    }
};

export const getAllProfiles = async (req, res, next) => {
    try {
        const { data, pagination } = await profileService.getAllProfiles(req.query);
        sendSuccess(res, { profiles: data }, 200, pagination);
    } catch (err) {
        next(err);
    }
};

export const getProfileById = async (req, res, next) => {
    try {
        const profile = await profileService.getProfileById(req.params.id);
        sendSuccess(res, { profile });
    } catch (err) {
        next(err);
    }
};

export const createProfile = async (req, res, next) => {
    try {
        const result = await profileService.createProfile(req.body);
        sendSuccess(res, result, 201);
    } catch (err) {
        next(err);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const profile = await profileService.updateProfile(req.params.id, req.body);
        sendSuccess(res, { profile });
    } catch (err) {
        next(err);
    }
};

export const deleteProfile = async (req, res, next) => {
    try {
        await profileService.deleteProfile(req.params.id);
        sendSuccess(res, "Profile deleted successfully", 200);
    } catch (err) {
        next(err);
    }
};