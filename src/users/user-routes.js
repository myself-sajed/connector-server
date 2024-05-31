import { Router } from 'express'
import userValidator from './user-validator.js';
import userController from './user-controller.js';
import multerConfig from '../lib/multerConfig.js';
const router = Router();
const upload = multerConfig()

router.post('/create', userValidator, userController.createUser)
router.post('/checkUsername', userController.checkUsername)
router.post('/edit', userController.editUser)
router.get('/:loggedInUserId', userController.getUsers)
router.get('/avatar/:filename', userController.getAvatar)


export default router