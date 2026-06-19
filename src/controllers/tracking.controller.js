import * as trackingService from '../services/tracking.service.js';
import * as pickupSettingService from '../services/pickup_setting.service.js';
import { sendSuccess } from '../utils/response.js';

export const setPickupTime = async (req, res, next) => {
    try {
        const setting = await pickupSettingService.setPickupTime(req.body.pickupTime, req.user._id);
        sendSuccess(res, { setting });
    } catch (err) {
        next(err);
    }
};

export const getPickupSetting = async (req, res, next) => {
    try {
        const setting = await pickupSettingService.getPickupSetting();
        sendSuccess(res, { setting });
    } catch (err) {
        next(err);
    }
};

export const generateTracking = async (req, res, next) => {
    try {
        const result = await trackingService.generateDailyTracking();
        sendSuccess(res, result);
    } catch (err) {
        next(err);
    }
};

export const verifyBarcode = async (req, res, next) => {
    try {
        const profile = await trackingService.verifyBarcode(req.params.parentProfileId);
        sendSuccess(res, { profile });
    } catch (err) {
        next(err);
    }
};
export const getTrackingById = async (req, res, next) => {
    try {
        const tracking = await trackingService.getTrackingById(req.params.trackId);
        sendSuccess(res, { tracking });
    } catch (err) {
        next(err);
    }
};

export const startTracking = async (req, res, next) => {

    console.log("hit")
    try {
        const tracking = await trackingService.startTracking(req.params.parentProfileId);
        sendSuccess(res, { tracking });
    } catch (err) {
        next(err);
    }
};

export const arrivedHome = async (req, res, next) => {
    try {
        const tracking = await trackingService.arrivedHome(req.params.parentProfileId);
        sendSuccess(res, { tracking });
    } catch (err) {
        next(err);
    }
};

export const deleteTracking = async (req, res, next) => {
    try {
        await trackingService.deleteTracking(req.params.parentProfileId);
        sendSuccess(res, null, 204);
    } catch (err) {
        next(err);
    }
};

export const getTrackingHistory = async (req, res, next) => {
    try {
        const { data, pagination } = await trackingService.getTrackingHistory(
            req.query
        );
        sendSuccess(res, { history: data }, 200, pagination);
    } catch (err) {
        next(err);
    }
};

export const getTodayTracking = async (req, res, next) => {
    try {
        const { data, pagination } = await trackingService.getTodayTracking(
            req.query
        );
        sendSuccess(res, { trackings: data }, 200, pagination);
    } catch (err) {
        next(err);
    }
};
