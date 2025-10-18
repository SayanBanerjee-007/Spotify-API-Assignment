import { ApiResponse } from './ApiResponse.js'

const asyncHandler = callBack => {
	return async (req, res, next) => {
		try {
			await callBack(req, res, next)
		} catch (error) {
			// console.log('\nasyncHandler error.stack:\n\n', error.stack)
			res
				.status(error.statusCode || 500)
				.send(
					new ApiResponse(
						error.statusCode || 500,
						error.data,
						error.message || 'Internal Server Error.',
						error.errors
					)
				)
		}
	}
}

export { asyncHandler }
