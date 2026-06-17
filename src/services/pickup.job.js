import cron from 'node-cron';
import PickupSetting from '../models/pickup_setting.model.js';
import { generateDailyTracking } from '../services/tracking.service.js';

const padZero = (n) => String(n).padStart(2, '0');

const getCurrentTime = () => {
    const now = new Date();
    return `${padZero(now.getHours())}:${padZero(now.getMinutes())}`;
};

export const startPickupJob = () => {
    cron.schedule('* * * * *', async () => {
        try {
            const setting = await PickupSetting.findOne();
            if (!setting) return;

            const currentTime = getCurrentTime();
            if (currentTime !== setting.pickupTime) return;

            console.log(`[CRON] Pickup time matched (${currentTime}), generating tracking...`);
            const result = await generateDailyTracking();
            console.log(`[CRON] Done — generated: ${result.generated}, skipped: ${result.skipped}`);
        } catch (err) {
            console.error('[CRON] Error generating tracking:', err.message);
        }
    });

    console.log('[CRON] Pickup job started');
};