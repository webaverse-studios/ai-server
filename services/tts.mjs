import fetch from 'node-fetch'

import { ELEVEN_LABS_API_KEY, ELEVEN_LABS_BASE_URL } from '../config.mjs'

const voiceId = '21m00Tcm4TlvDq8ikWAM'

/**
 * Get the transcription of an audio file
 *
 * @param {object} ttsRequestObj The body of the request to the Eleven Labs API
 * @param {string} ttsRequestObj.text The text to be converted to speech
 * @returns {Promise<import('node-fetch').Response>} The response from the Eleven Labs API
 */
export async function getTTSReponse ({ text }) {
  return fetch( `${ELEVEN_LABS_BASE_URL}/${voiceId}/stream`, {
    body: JSON.stringify({
      text,
      voice_settings: {
        stability: 0.15,
        similarity_boost: 1,
      },
    }),
    method: 'POST',
    headers: {
      accept: '*/*',
      'xi-api-key': ELEVEN_LABS_API_KEY,
      'Content-Type': 'application/json',
    },
  })
}
