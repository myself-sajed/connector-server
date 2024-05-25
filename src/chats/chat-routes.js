import { Router } from 'express'
import chatController from './chat-controller.js';

const router = Router();

router.get('/:meId', chatController.getChats)
router.post('/create', chatController.createChat)


export default router