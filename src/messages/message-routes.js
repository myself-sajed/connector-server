import { Router } from 'express'
import messageController from './message-controller.js'

const router = Router()

router.get('/:contactId/:meId', messageController.getMessages)


export default router