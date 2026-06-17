import { Router } from 'express';
import * as teacherProfileController from '../controllers/teacher_profile.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import {
    createTeacherProfileSchema,
    updateTeacherProfileSchema,
} from '../validators/teacher_profile.validator.js';

const router = Router();

router.use(authenticate);

// teacher routes
router.get('/teacher-profiles/me', teacherProfileController.getMyProfile);
router.put('/teacher-profiles/me', validate(updateTeacherProfileSchema), teacherProfileController.updateMyProfile);

// admin routes
router.post('/teacher-profiles', authorize('admin'), validate(createTeacherProfileSchema), teacherProfileController.createTeacherProfile);
router.put('/teacher-profiles/:id', authorize('admin'), validate(updateTeacherProfileSchema), teacherProfileController.updateProfileById);
router.get('/teacher-profiles', authorize('admin'), teacherProfileController.getAllTeacherProfiles);
router.get('/teacher-profiles/:id', authorize('admin'), teacherProfileController.getTeacherProfileById);
router.delete('/teacher-profiles/:id', authorize('admin'), teacherProfileController.deleteTeacherProfile);

export default router;