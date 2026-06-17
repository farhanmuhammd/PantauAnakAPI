import * as classService from '../services/class.service.js';
import { sendSuccess } from '../utils/response.js';

export const createClass = async (req, res, next) => {
    try {
        const cls = await classService.createClass(req.body);
        sendSuccess(res, { class: cls }, 201);
    } catch (err) {
        next(err);
    }
};

export const getAllClasses = async (req, res, next) => {
    try {
        const { data, pagination } = await classService.getAllClasses(req.query);
        sendSuccess(res, { classes: data }, 200, pagination);
    } catch (err) {
        next(err);
    }
};

export const getClassById = async (req, res, next) => {
    try {
        const cls = await classService.getClassById(req.params.id);
        sendSuccess(res, { class: cls });
    } catch (err) {
        next(err);
    }
};

export const updateClass = async (req, res, next) => {
    try {
        const cls = await classService.updateClass(req.params.id, req.body);
        sendSuccess(res, { class: cls });
    } catch (err) {
        next(err);
    }
};

export const deleteClass = async (req, res, next) => {
    try {
        await classService.deleteClass(req.params.id);
        sendSuccess(res, null, 204);
    } catch (err) {
        next(err);
    }
};