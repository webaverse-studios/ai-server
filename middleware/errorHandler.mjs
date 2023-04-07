/**
 * @typedef {import('express').Response} Response
 * @typedef {import('express').Request} Request
 * @typedef {import('express').NextFunction} NextFunction
 */

/**
 * @typedef {object} Error
 * @property {string} message Error message
 * @property {number} status HTTP status code
 */

/**
 * Error handling Middleware function for logging the error message
 *
 * @param {Error} error Error object
 * @param {Request} req Request object
 * @param {Response} res Response object
 * @param {NextFunction} next Next middleware function
 */
export function errorLogger( error, req, res, next ) {
  console.error( `error ${error.message}` )
  next( error ) // calling next middleware
}

/**
 * Error handling Middleware function reads the error message
 * and sends back a response in JSON format
 *
 * @param {Error} error Error object
 * @param {Request} req Request object
 * @param {Response} res Response object
 */
export function errorResponder( error, req, res ) {
  res.header( 'Content-Type', 'application/json' )

  const status = error.status || res.statusCode || 500
  res.status( status ).send( error.message )
}

/**
 * Fallback Middleware function for returning
 * 404 error for undefined paths
 *
 * @param {Error} error Error object
 * @param {Request} req Request object
 * @param {Response} res Response object
 */
export function invalidPathHandler( error, req, res ) {
  res.status( 404 )
  res.send( 'invalid path' )
}
