import { Router } from 'express';
import * as userController from '../controllers/user.controller.js';
import { authenticate, authorize } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { updateUserSchema } from '../validators/user.validator.js';
import { registerSchema } from '../validators/auth.validator.js';

const router = Router();

// router.use(authenticate, authorize('admin'));

router
  .route('/users')
  .get(userController.getUsers)

  router
  .route('/users/:id')
  .get(userController.getUser)
  .put(validate(updateUserSchema), userController.updateUser)
  .delete(userController.deleteUser);

export default router;
