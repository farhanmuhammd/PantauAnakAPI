import { Router } from 'express';
import * as classController from '../controllers/class.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { classSchema, updateClassSchema } from '../validators/class.validator.js';

const router = Router();

// router.use(authenticate, authorize('admin', 'teacher'));

router.get('/classes', classController.getAllClasses)
router.get('/classes/:id', classController.getClassById)
router.post('/classes', validate(classSchema), classController.createClass)
router.put('/classes/:id', validate(updateClassSchema), classController.updateClass)
router.delete('/classes/:id', classController.deleteClass)

export default router;