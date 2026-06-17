import PickupSetting from '../models/pickup_setting.model.js';
import { AppError } from '../utils/errors.js';

export const setPickupTime = async (pickupTime, userId) => {
    const existing = await PickupSetting.findOne();

    if (existing) {
        existing.pickupTime = pickupTime;
        existing.setBy = userId;
        await existing.save();
        return existing;
    }

    return PickupSetting.create({ pickupTime, setBy: userId });
};

export const getPickupSetting = async () => {
    const setting = await PickupSetting.findOne().populate('setBy', 'email');
    if (!setting) throw new AppError('Pickup time has not been set yet', 404);
    return setting;
};