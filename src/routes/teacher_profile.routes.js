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

router.get('/teacher-profiles', teacherProfileController.getAllTeacherProfiles);
router.get('/teacher-profiles/:id', teacherProfileController.getTeacherProfileById);


// admin routes
router.post('/teacher-profiles', validate(createTeacherProfileSchema), teacherProfileController.createTeacherProfile);
router.put('/teacher-profiles/:id', validate(updateTeacherProfileSchema), teacherProfileController.updateProfileById);

router.delete('/teacher-profiles/:id', teacherProfileController.deleteTeacherProfile);

export default router;