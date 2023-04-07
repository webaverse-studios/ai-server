import { Readable } from 'stream'

import { getSTTReponse } from '../services/stt.mjs'

/**
 * Handle the request to the STT API
 *
 * @param {import('express').Request} req The request to the STT API
 * @param {import('express').Response} res The response from the STT API
 */
export default async ( req, res ) => {
  let audioBody = req.body
  const proxyResponse = await getSTTReponse( audioBody )

  if ( !proxyResponse.ok ) {
    const text = await proxyResponse.text()
    console.error( '[TTS Error]: ', text )
    res.status( 500 ).send( text )
    return
  }

  // Set headers
  ['content-type', 'content-length'].forEach(( name ) => {
    const value = proxyResponse.headers.get( name )
    if ( value ) {
      res.setHeader( name, value )
    }
  })

  res.status( proxyResponse.status )

  // @ts-ignore
  Readable.fromWeb( proxyResponse.body ).pipe( res )
}
