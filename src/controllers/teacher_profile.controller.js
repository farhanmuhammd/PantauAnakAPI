import * as teacherProfileService from '../services/teacher_profile.service.js';
import { sendSuccess } from '../utils/response.js';

export const createTeacherProfile = async (req, res, next) => {
    try {
        const result = await teacherProfileService.createTeacherProfile(req.body);
        sendSuccess(res, result, 201);
    } catch (err) {
        next(err);
    }
};

export const getMyProfile = async (req, res, next) => {
    try {
        const profile = await teacherProfileService.getMyTeacherProfile(req.user._id);
        sendSuccess(res, { profile });
    } catch (err) {
        next(err);
    }
};

export const updateMyProfile = async (req, res, next) => {
    try {
        const profile = await teacherProfileService.updateTeacherProfile(req.user._id, req.body);
        sendSuccess(res, { profile });
    } catch (err) {
        next(err);
    }
};

export const updateProfileById = async (req, res, next) => {
    try {
        const profile = await teacherProfileService.updateTeacherProfileById(req.params.id, req.body);
        sendSuccess(res, { profile });
    } catch (err) {
        next(err);
    }
};

export const getAllTeacherProfiles = async (req, res, next) => {
    try {
        const { data, pagination } = await teacherProfileService.getAllTeacherProfiles(req.query);
        sendSuccess(res, { profiles: data }, 200, pagination);
    } catch (err) {
        next(err);
    }
};

export const getTeacherProfileById = async (req, res, next) => {
    try {
        const profile = await teacherProfileService.getTeacherProfileById(req.params.id);
        sendSuccess(res, { profile });
    } catch (err) {
        next(err);
    }
};

export const deleteTeacherProfile = async (req, res, next) => {
    try {
        await teacherProfileService.deleteTeacherProfile(req.params.id);
        sendSuccess(res, null, 204);
    } catch (err) {
        next(err);
    }
};