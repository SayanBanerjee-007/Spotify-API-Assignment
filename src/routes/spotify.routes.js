import express from 'express'
import { requireAuth } from '../middleware/auth.middleware.js'
import {
	getSpotifyData,
	playTrack,
	stopPlayback,
	getTopTracks,
	getNowPlaying,
} from '../controllers/spotify.controller.js'

const router = express.Router()

router.use(requireAuth)

router.get('/', getSpotifyData)
router.get('/top-tracks', getTopTracks)
router.get('/now-playing', getNowPlaying)
router.post('/play', playTrack)
router.post('/stop', stopPlayback)

export default router
