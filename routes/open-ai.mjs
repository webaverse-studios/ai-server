import {
  getChatCompletionResponse,
  getCompletionResponse,
  getEmbeddedResponse,
  getImageGenerationsResponse,
  getSTTReponse,
} from '../services/index.mjs'

export const config = {
  runtime: 'edge',
}

/**
 * Enum for Open AI Methods
 *
 * @readonly
 * @enum {string}
 */
export const OPEN_AI_METHOD = {
  STT: 'STT',
  EMBEDDINGS: 'EMBEDDINGS',
  COMPLETION: 'COMPLETION',
  CHAT_COMPLETION: 'CHAT_COMPLETION',
  IMAGES_GENERATION: 'IMAGES_GENERATION',
}

/**
 * Handle the request to the STT API
 *
 * @param {import('express').Request} req The request to the STT API
 * @param {import('express').Response} res The response from the STT API
 * @param {OPEN_AI_METHOD} method The open ai method to use
 */
export default async ( req, res, method ) => {
  let proxyResponse
  switch ( method ) {
    // /completions
    case OPEN_AI_METHOD.COMPLETION:
      proxyResponse = await getCompletionResponse( req.body )
      break

    // /chat/completions
    case OPEN_AI_METHOD.CHAT_COMPLETION:
      proxyResponse = await getChatCompletionResponse( req.body )
      break

    // /images/generations
    case OPEN_AI_METHOD.IMAGES_GENERATION:
      proxyResponse = await getImageGenerationsResponse( req.body )
      break

    // /embeddings
    case OPEN_AI_METHOD.EMBEDDINGS:
      proxyResponse = await getEmbeddedResponse( req.body )
      break

    // /stt
    case OPEN_AI_METHOD.STT: {
      let audioFile = req.files?.[0]
      proxyResponse = await getSTTReponse({
        ...req.body,
        audioFile,
      })

      break
    }
  }

  if ( !proxyResponse ) {
    console.error( 'proxyResponse is undefined. This should not happen...' )
    return res.status( 500 )
  }

  if ( !proxyResponse.ok ) {
    const text = await proxyResponse.text()
    console.error( '[OPEN AI Error]: ', text )
    return res.status( 500 ).send( text )
  }

  res.status( proxyResponse.status )
  proxyResponse.body?.pipe( res )
}
