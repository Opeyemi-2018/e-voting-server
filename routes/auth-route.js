import express from 'express'
import { SignUp, SignIn } from '../controller/auth-controller.js'

const router = express.Router()

router.use('/sign-up', SignUp)
router.use('/sign-in', SignIn)
export default router