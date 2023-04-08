import fetch from 'node-fetch'

import { ELEVEN_LABS_API_KEY, ELEVEN_LABS_BASE_URL } from '../config.mjs'

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
 * @param {VoiceSettings} ttsBody.voice_settings The settings of the voice
 * @returns {Promise<import('node-fetch').Response>} The response from the Eleven Labs API
 */
export async function getTTSReponse({ voiceId, text, voice_settings }) {
  return fetch( `${ELEVEN_LABS_BASE_URL}/${voiceId}/stream`, {
    body: JSON.stringify({
      text,
      voice_settings,
    }),
    method: 'POST',
    headers: {
      accept: '*/*',
      'xi-api-key': ELEVEN_LABS_API_KEY,
      'Content-Type': 'application/json',
    },
  })
}
