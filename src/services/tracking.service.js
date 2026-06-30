import Tracking from '../models/tracking.model.js';
import { NotFoundError, AppError } from '../utils/errors.js';
import { getPagination, buildPaginatedResponse } from '../utils/pagination.js';
import ParentProfile from '../models/parent_profile.model.js';

const getTodayDate = () => new Date().toISOString().split('T')[0];

export const generateDailyTracking = async () => {
    const today = getTodayDate();

    const [parentProfiles, existingTrackings] = await Promise.all([
        ParentProfile.find({ 'children.0': { $exists: true } }),
        Tracking.find({ date: today }).select('parentProfileId'),
    ]);

    const alreadyTrackedIds = new Set(
        existingTrackings.map((t) => t.parentProfileId.toString())
    );

    const toInsert = [];

    for (const profile of parentProfiles) {
        if (alreadyTrackedIds.has(profile._id.toString())) continue;

        for (const child of profile.children) {
            if (!child.classId) continue;

            toInsert.push({
                parentProfileId: profile._id,
                classId: child.classId,
                date: today,
                status: 'waiting_pickup',
                waitingPickupAt: new Date(),
                statusHistory: [{ status: 'waiting_pickup', timestamp: new Date() }],
            });
        }
    }

    if (toInsert.length === 0) {
        return { generated: 0, skipped: parentProfiles.length };
    }

    await Tracking.insertMany(toInsert, { ordered: false });

    return {
        generated: toInsert.length,
        skipped: parentProfiles.length - toInsert.length,
    };
};

export const getTrackingById = async (trackId) => {
    const tracking = await Tracking.findById(trackId)
        .populate('classId', 'name')
        .populate('parentProfileId', 'children parents');

    if (!tracking) throw new NotFoundError('tracking not found');
    return tracking;
};

export const verifyBarcode = async (parentProfileId) => {

    const profile = await ParentProfile.findById(parentProfileId)
        .populate('children.classId', 'name')
        .populate('userId', 'email');

    if (!profile) throw new NotFoundError('Profile not found');
    return profile;
};

export const startTracking = async (parentProfileId) => {
    const today = getTodayDate();

    const tracking = await Tracking.findOne({ parentProfileId, date: today });
    if (!tracking) throw new NotFoundError('No tracking found for today');

    if (tracking.status !== 'waiting_pickup') {
        throw new AppError(`Cannot start tracking, current status is ${tracking.status}`, 400);
    }

    tracking.status = 'on_the_way';
    tracking.onTheWayAt = new Date();
    tracking.statusHistory.push({ status: 'on_the_way', timestamp: new Date() });
    await tracking.save();

    return tracking;
};

export const arrivedHome = async (parentProfileId) => {
    const today = getTodayDate();

    const tracking = await Tracking.findOne({ parentProfileId, date: today });
    if (!tracking) throw new NotFoundError('No tracking found for today');

    if (tracking.status !== 'on_the_way') {
        throw new AppError(`Cannot update status, current status is ${tracking.status}`, 400);
    }

    tracking.status = 'arrived_home';
    tracking.arrivedHomeAt = new Date();
    tracking.statusHistory.push({ status: 'arrived_home', timestamp: new Date() });
    await tracking.save();

    return tracking;
};

export const deleteTracking = async (id) => {
    const tracking = await Tracking.findOneAndDelete({ _id: id });
    if (!tracking) throw new NotFoundError('No tracking found for today');
};

export const getTrackingHistory = async (query) => {
    const { page, limit, skip } = getPagination(query);

    const filter = {};

    if (query.classId) {
        filter.classId = query.classId;
    } else if (query.parentProfileId) {
        filter.parentProfileId = query.parentProfileId;
    }


    const [history, total] = await Promise.all([
        Tracking.find(filter).populate('parentProfileId', 'children parents').sort({ date: -1 }).skip(skip).limit(limit),
        Tracking.countDocuments(filter),
    ]);
    return buildPaginatedResponse(history, total, page, limit);
};

export const getTodayTracking = async (query) => {
    const today = getTodayDate();
    const { page, limit, skip } = getPagination(query);

    const filter = { date: today };

    if (query.classId) {
        filter.classId = query.classId;
    } else if (query.parentProfileId) {
        filter.parentProfileId = query.parentProfileId;
    }

    const [trackings, total] = await Promise.all([
        Tracking.find(filter)
            .populate('parentProfileId', 'children parents')
            .skip(skip)
            .limit(limit),
        Tracking.countDocuments(filter),
    ]);

    return buildPaginatedResponse(trackings, total, page, limit);
};