import * as parentProfileService from '../services/parent_profile.service.js';
import { sendSuccess } from '../utils/response.js';

export const createParentProfile = async (req, res, next) => {
    try {
        const result = await parentProfileService.createParentProfile(req.body);
        sendSuccess(res, result, 201);
    } catch (err) {
        next(err);
    }
};

export const getMyProfile = async (req, res, next) => {
    try {
        const profile = await parentProfileService.getMyParentProfile(req.user._id);
        sendSuccess(res, { profile });
    } catch (err) {
        next(err);
    }
};

export const updateMyProfile = async (req, res, next) => {
    try {
        const profile = await parentProfileService.updateMyParentProfile(req.user._id, req.body);
        sendSuccess(res, { profile });
    } catch (err) {
        next(err);
    }
};

export const updateProfileById = async (req, res, next) => {
    try {
        const profile = await parentProfileService.updateProfileById(req.params.id, req.body);
        sendSuccess(res, { profile });
    } catch (err) {
        next(err);
    }
};

export const getAllParentProfiles = async (req, res, next) => {
    try {
        const { data, pagination } = await parentProfileService.getAllParentProfiles(req.query);
        sendSuccess(res, { profiles: data }, 200, pagination);
    } catch (err) {
        next(err);
    }
};

export const getParentProfileById = async (req, res, next) => {
    try {
        const profile = await parentProfileService.getParentProfileById(req.params.id);
        sendSuccess(res, { profile });
    } catch (err) {
        next(err);
    }
};

export const deleteParentProfile = async (req, res, next) => {
    try {
        await parentProfileService.deleteParentProfile(req.params.id);
        sendSuccess(res, null, 204);
    } catch (err) {
        next(err);
    }
};