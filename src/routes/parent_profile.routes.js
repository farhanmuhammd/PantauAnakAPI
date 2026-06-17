import { Router } from 'express';
import * as parentProfileController from '../controllers/parent_profile.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
    createParentProfileSchema,
    updateParentProfileSchema,
} from '../validators/parent_profile.validator.js';

const router = Router();

router.use(authenticate);

// parent routes
router.get('/parent-profiles/me', parentProfileController.getMyProfile);
router.put('/parent-profiles/me', validate(updateParentProfileSchema), parentProfileController.updateMyProfile);

// admin routes
router.post('/parent-profiles', authorize('admin'), validate(createParentProfileSchema), parentProfileController.createParentProfile);
router.put('/parent-profiles/:id', authorize('admin'), validate(updateParentProfileSchema), parentProfileController.updateProfileById);
router.get('/parent-profiles', authorize('admin'), parentProfileController.getAllParentProfiles);
router.get('/parent-profiles/:id', authorize('admin'), parentProfileController.getParentProfileById);
router.delete('/parent-profiles/:id', authorize('admin'), parentProfileController.deleteParentProfile);

export default router;