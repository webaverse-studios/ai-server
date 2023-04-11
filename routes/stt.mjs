import { getSTTReponse } from '../services/index.mjs'

/**
 * Handle the request to the STT API
 *
 * @param {import('express').Request} req The request to the STT API
 * @param {import('express').Response} res The response from the STT API
 */
export default async ( req, res ) => {
  let audioFile = req.files?.[0]
  let { model, language, responseFormat } = req.body

  const proxyResponse = await getSTTReponse({
    model,
    language,
    audioFile,
    responseFormat,
  })

  if ( !proxyResponse.ok ) {
    const text = await proxyResponse.text()
    console.error( '[STT Error]: ', text )
    return res.status( 500 ).send( text )
  }

  // Set headers
  ['content-type', 'content-length'].forEach(( name ) => {
    const value = proxyResponse.headers.get( name )
    if ( value ) {
      res.setHeader( name, value )
    }
  })

  res.status( proxyResponse.status )
  proxyResponse.body?.pipe( res )
}
