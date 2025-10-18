import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import authRoutes from './routes/auth.routes.js'
import rootRoutes from './routes/root.routes.js'
import spotifyRoutes from './routes/spotify.routes.js'
import { serverConfig } from './config/server.config.js'
import { corsOptions } from './config/cors.config.js'
import {
	errorHandler,
	notFound,
} from './middleware/error.middleware.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()

// View Engine Setup ==================
app.set('view engine', 'ejs')
app.set('views', join(__dirname, 'views'))

// Static Files =======================
app.use(express.static(join(__dirname, 'public')))

// Middleware =========================
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// API Routes =========================
app.use('/', rootRoutes)
app.use('/auth', authRoutes)
app.use('/spotify', spotifyRoutes)

// Error Handling =====================
app.use(notFound)
app.use(errorHandler)

const PORT = serverConfig.port
app.listen(PORT, () => {
	console.log(`Spotify API Server running on port ${PORT}`)
	console.log(`Server URL: http://localhost:${PORT}`)
})

export default app
