import Class from '../models/class.model.js';
import { NotFoundError } from '../utils/errors.js';
import { getPagination, buildPaginatedResponse } from '../utils/pagination.js';

export const createClass = async (data) => {
    return Class.create(data);
};

export const getAllClasses = async (query) => {
    const { page, limit, skip } = getPagination(query);
    const [classes, total] = await Promise.all([
        Class.find().skip(skip).limit(limit),
        Class.countDocuments(),
    ]);
    return buildPaginatedResponse(classes, total, page, limit);
};

export const getClassById = async (id) => {
    const cls = await Class.findById(id);
    if (!cls) throw new NotFoundError('Class not found');
    return cls;
};

export const updateClass = async (id, data) => {
    const cls = await Class.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!cls) throw new NotFoundError('Class not found');
    return cls;
};

export const deleteClass = async (id) => {
    const cls = await Class.findByIdAndDelete(id);
    if (!cls) throw new NotFoundError('Class not found');
};