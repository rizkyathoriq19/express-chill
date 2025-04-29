import express from 'express';
import { userController } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/', userController.getAllUser);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.softDeleteUser);

export default router;
