import { getChatCompletionResponse } from '../services/index.mjs'

/**
 * Handle the request to the STT API
 *
 * @param {import('express').Request} req The request to the STT API
 * @param {import('express').Response} res The response from the STT API
 */
export default async ( req, res ) => {
  let { model, messages } = req.body
  console.log( req.body )

  const proxyResponse = await getChatCompletionResponse({
    model,
    messages,
  })

  if ( !proxyResponse.ok ) {
    const text = await proxyResponse.text()
    console.error( '[Chat Completion Error]: ', text )
    return res.status( 500 ).send( text )
  }

  res.status( proxyResponse.status )
  proxyResponse.body?.pipe( res )
}
