import express from 'express'
import {
	login,
	callback,
	status,
} from '../controllers/auth.controller.js'

const router = express.Router()

router.get('/login', login)
router.get('/callback', callback)
router.get('/status', status)

export default router
