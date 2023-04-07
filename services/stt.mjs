import fetch from 'node-fetch'

import { OPENAI_API_BASE_URL, OPENAI_API_KEY } from '../config.mjs'

/**
 * @typedef {object} AudioBody The body of the request to the OpenAI API
 * @property {string} file The base64 encoded audio file
 */

/**
 * Get the transcription of an audio file
 *
 * @param {AudioBody} audioBody The body of the request to the OpenAI API
 * @returns {Promise<import('node-fetch').Response>} The response from the OpenAI API
 */
export async function getSTTReponse ( audioBody ) {
  return fetch( `${OPENAI_API_BASE_URL}/audio/transcriptions`, {
    // @ts-ignore
    duplex: 'half',
    method: 'POST',
    body: JSON.stringify({
      ...audioBody,
      model: 'whisper-1',
    }),
    headers: {
      accept: '*/*',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
  })
}
