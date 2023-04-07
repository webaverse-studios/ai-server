import FormData from 'form-data'
import fetch from 'node-fetch'

import { OPENAI_API_BASE_URL, OPENAI_API_KEY } from '../config.mjs'

const DEFAULT_LANGUAGE = 'en'
const DEFAULT_MODEL = 'whisper-1'
const DEFAULT_RESPONSE_FORMAT = 'verbose_json'

/**
 * @typedef {object} AudioBody The body of the request to the OpenAI API
 * @property {string} model The model to use
 * @property {Blob} file The base64 encoded audio file
 * @property {string} language The language of the audio file
 * @property {string} responseFormat The format of the response
 */

/**
 * Get the transcription of an audio file
 *
 * @param {AudioBody} audioBody The body of the request to the OpenAI API
 * @param {import('express').Request['file']} audioFile The audio file
 * @returns {Promise<import('node-fetch').Response>} The response from the OpenAI API
 */
export async function getSTTReponse( audioBody, audioFile ) {
  const fd = new FormData()
  fd.append( 'model', audioBody.model ?? DEFAULT_MODEL )
  fd.append( 'language', audioBody.language ?? DEFAULT_LANGUAGE )
  fd.append(
    'responseFormat',
    audioBody.responseFormat ?? DEFAULT_RESPONSE_FORMAT
  )
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
