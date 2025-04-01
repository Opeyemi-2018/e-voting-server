import express from 'express'
import { CastVote } from '../controller/vote-controller.js'

const router = express.Router()

router.post("/cast-vote", CastVote )
export default router