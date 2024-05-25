import { Router } from 'express'
import messageController from './message-controller.js'

const router = Router()

router.get('/:chatId', messageController.getMessages)


export default router