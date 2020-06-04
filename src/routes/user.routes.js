import { Router } from 'express';

import authController from '../controllers/auth.controller';
import userController from '../controllers/user.controller';

const router = Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.route('/profile').get(userController.getUser).patch(userController.updateUser);

router.patch('/updatePassword', authController.protect, authController.updatePassword);

module.exports = router;
