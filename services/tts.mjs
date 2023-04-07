import fetch from 'node-fetch'

import { ELEVEN_LABS_API_KEY, ELEVEN_LABS_BASE_URL } from '../config.mjs'

const DEFAULT_VOICE_ID = '21m00Tcm4TlvDq8ikWAM'

/**
 * @typedef {object} VoiceSettings
 * @property {number} stability The stability of the voice
 * @property {number} similarity_boost The similarity boost of the voice
 */

/**
 * Get the transcription of an audio file
 *
 * @param {object} ttsBody The body of the request to the Eleven Labs API
 * @param {string} ttsBody.voiceId The text to be converted to speech
 * @param {string} ttsBody.text The text to be converted to speech
 * @param {VoiceSettings} ttsBody.voiceSettings The settings of the voice
 * @returns {Promise<import('node-fetch').Response>} The response from the Eleven Labs API
 */
export async function getTTSReponse( ttsBody ) {
  let voiceId = ttsBody['voiceId'] ?? DEFAULT_VOICE_ID

  return fetch( `${ELEVEN_LABS_BASE_URL}/${voiceId}/stream`, {
    body: JSON.stringify( ttsBody ),
    method: 'POST',
    headers: {
      accept: '*/*',
      'xi-api-key': ELEVEN_LABS_API_KEY,
      'Content-Type': 'application/json',
    },
  })
}
