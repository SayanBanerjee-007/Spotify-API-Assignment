import { ApiResponse } from '../utils/ApiResponse.js'

export const errorHandler = (err, req, res, next) => {
	const statusCode = err.statusCode || 500
	const message = err.message || 'Internal Server Error'

	console.error(`[ERROR] ${req.method} ${req.originalUrl}:`, {
		message: err.message,
		statusCode,
		stack:
			process.env.NODE_ENV === 'development' ? err.stack : undefined,
	})

	res
		.status(statusCode)
		.json(
			new ApiResponse(
				statusCode,
				err.data || null,
				message,
				err.errors || []
			)
		)
}

export const notFound = (req, res) => {
	res
		.status(404)
		.json(
			new ApiResponse(
				404,
				null,
				`Route ${req.method} ${req.originalUrl} not found`
			)
		)
}
