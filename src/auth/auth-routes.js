import { Router } from 'express'
import authController from './auth-controller.js';

const router = Router();


router.get('/authenticate', authController.authenticate)

router.post('/login', authController.login)

router.post('/logout', authController.logout)



export default router