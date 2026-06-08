import { Router } from 'express';
import * as profileController from '../controllers/profile.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { createProfileSchema, updateProfileSchema } from '../validators/profile.validator.js';

const router = Router();

router.use(authenticate);

// user routes
router.get('/profiles/me', profileController.getMyProfile);

// admin routes
router.post('/profiles', authorize('admin'), validate(createProfileSchema), profileController.createProfile);
router.put('/profiles/:id', validate(updateProfileSchema), profileController.updateProfile);
router.get('/profiles', authorize('admin'), profileController.getAllProfiles);
router.get('/profiles/:id', authorize('admin'), profileController.getProfileById);
router.delete('/profiles/:id', authorize('admin'), profileController.deleteProfile);

export default router;