import FormData from 'form-data'
import fetch from 'node-fetch'

import { OPENAI_API_BASE_URL, OPENAI_API_KEY } from '../config.mjs'

const language = 'en'
const model = 'whisper-1'
const responseFormat = 'verbose_json'

/**
 * @typedef {object} AudioBody The body of the request to the OpenAI API
 * @property {Blob} file The base64 encoded audio file
 */

/**
 * Get the transcription of an audio file
 *
 * @param {import('express').Request['file']} audioFile The audio file
 * @returns {Promise<import('node-fetch').Response>} The response from the OpenAI API
 */
export async function getSTTReponse( audioFile ) {
  const fd = new FormData()
  fd.append( 'model', model )
  fd.append( 'language', language )
  fd.append( 'response_format', responseFormat )
  fd.append( 'file', audioFile?.buffer, 'speech.webm' )

  return fetch( `${OPENAI_API_BASE_URL}/audio/transcriptions`, {
    body: fd,
    // @ts-ignore
    duplex: 'half',
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
  })
}
