import dotenv from 'dotenv'

dotenv.config()

export const serverConfig = {
	port: process.env.PORT || 5000,
	sessionSecret:
		process.env.SESSION_SECRET ||
		'default_secret_change_in_production',
	nodeEnv: process.env.NODE_ENV || 'development',
}
