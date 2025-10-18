const isDevelopment = process.env.NODE_ENV !== 'production'

export const corsOptions = {
	origin: isDevelopment
		? true
		: process.env.ALLOWED_ORIGINS?.split(',').map(o => o.trim()),
	credentials: true,
	optionsSuccessStatus: 200,
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
}
