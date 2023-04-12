// @ts-nocheck

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
  /** @type {Response} */
  let proxyResponse

  try {
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
  } catch ( e ) {
    console.error( '[Internal Server Error]: ', e )
    return res.status( 500 )
  }

  // If the response failed, log the error and return a 500
  if ( !proxyResponse.ok ) {
    const text = await proxyResponse.text()
    console.error( '[OPEN AI Error]: ', text )
    return res.status( 500 ).send( text )
  }

  // Grab stream reader and iterate over it
  const reader = proxyResponse.body?.getReader()
  if ( !reader ) {
    // If there is no steam, send the body back instead
    console.error( 'reader is undefined. This should not happen...' )
    return res.send( proxyResponse.body )
  }

  // Read the stream and write it to the response
  for await ( const chunk of readChunks( reader )) {
    res.write( chunk )
  }

  res.end()

  // res.status( proxyResponse.status )
  // res.setHeader( 'transfer-encoding', 'chunked' )
  // proxyResponse.body?.pipe( res )
  // res.send( proxyResponse.body )
}

/**
 * Reads from the provided reader and yields the results into an async iterable
 *
 * @param {ReadableStreamDefaultReader<Uint8Array>} reader Reader to read from
 * @returns {AsyncIterable<Uint8Array>} The async iterable
 */
function readChunks( reader ) {
  return {
    async *[Symbol.asyncIterator]() {
      let readResult = await reader.read()
      while ( !readResult.done ) {
        yield readResult.value
        readResult = await reader.read()
      }
    },
  }
}
