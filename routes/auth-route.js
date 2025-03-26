import express from 'express'
import { SignUp, SignIn, SignOut } from '../controller/auth-controller.js'

const router = express.Router()

router.post('/sign-up', SignUp)
router.post('/sign-in', SignIn)
router.get('/sign-out', SignOut)
export default router