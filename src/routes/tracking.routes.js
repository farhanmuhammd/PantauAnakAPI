import { Router } from 'express';
import * as trackingController from '../controllers/tracking.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { pickupTimeSchema } from '../validators/tracking.validator.js';

const router = Router();

router.use(authenticate);

// pickup setting — admin & guru
router.get('/settings/pickup', trackingController.getPickupSetting);
router.post('/settings/pickup', validate(pickupTimeSchema), trackingController.setPickupTime);

// generate manual — admin only (backup jika cron gagal)
router.post('/tracking/generate', authorize('admin', 'teacher'), trackingController.generateTracking);

// guru routes
router.get('/tracking/class/:classId', trackingController.getTodayTrackingByClass);
router.get('/tracking/verify/:profileId', trackingController.verifyBarcode);
router.put('/tracking/:profileId/start', trackingController.startTracking);
router.delete('/tracking/:profileId', trackingController.deleteTracking);

// orang tua routes
router.put('/tracking/:profileId/arrived', trackingController.arrivedHome);
router.get('/tracking/:profileId/history', trackingController.getTrackingHistory);

export default router;