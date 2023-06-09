import { getTTSReponse } from '../services/index.mjs'

/**
 * Handle the request to the TTS API
 *
 * @param {import('express').Request} req The request to the TTS API
 * @param {import('express').Response} res The response from the TTS API
 */
export default async ( req, res ) => {
  let { text, voice_settings } = req.body
  let { voiceId } = req.params

  const proxyResponse = await getTTSReponse({
    text,
    voiceId,
    voice_settings,
  })

  if ( !proxyResponse.ok ) {
    const text = await proxyResponse.text()
    console.error( '[TTS Error]: ', text )
    return res.sendStatus( 500 ).send( text )
  }

  proxyResponse.headers.forEach(( value, key ) => {
    res.setHeader( key, value )
  })

  proxyResponse.body?.pipe( res )
}
