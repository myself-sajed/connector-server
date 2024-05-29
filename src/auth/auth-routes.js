import { Router } from 'express'

const router = Router();


router.get('/self', (req, res) => {
    res.send('Self is ok')
})




export default router