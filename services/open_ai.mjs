// import FormData from 'form-data'
// import fetch from 'node-fetch'

import { OPENAI_API_BASE_URL, OPENAI_API_KEY } from '../config.mjs'

const DEFAULT_LANGUAGE = 'en'
const DEFAULT_MODEL = 'whisper-1'
const DEFAULT_RESPONSE_FORMAT = 'verbose_json'

/**
 * @typedef {object} AudioBody The body of the request to the OpenAI API
 * @property {string} model The model to use
 * @property {string} language The language of the audio file
 * @property {string} responseFormat The format of the response
 * @property {import('express').Request['file']} audioFile The audio file
 */

/**
 * Get the transcription of an audio file
 *
 * @param {AudioBody} params The body of the request to the OpenAI API
 * @returns {Promise<Response>} The response from the OpenAI API
 */
export async function getSTTReponse({ audioFile, ...audioBody }) {
  let body = Object.assign(
    {
      model: DEFAULT_MODEL,
      language: DEFAULT_LANGUAGE,
      responseFormat: DEFAULT_RESPONSE_FORMAT,
    },
    audioBody
  )

  if ( !audioFile?.buffer ) throw new Error( 'No audio file provided' )

  let buff = audioFile?.buffer
  const blob = new Blob([buff]) // JavaScript Blob

  const fd = new FormData()
  fd.append( 'model', body.model )
  fd.append( 'language', body.language )
  fd.append( 'response_format', body.responseFormat )
  fd.append( 'file', blob, 'speech.webm' )

  return fetch( `${OPENAI_API_BASE_URL}/audio/transcriptions`, {
    body: fd,
    // @ts-ignore
    duplex: 'half',
    method: 'POST',
    headers: {
      ContentType: 'multipart/form-data',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
  })
}

/**
 * Given a prompt, the model will return one or more predicted completions,
 * and can also return the probabilities of alternative tokens at each position.
 *
 * @param {object } req_body The body of the request to the OpenAI API
 */
export async function getCompletionResponse( req_body ) {
  return fetch( `${OPENAI_API_BASE_URL}/completions`, {
    method: 'POST',
    body: JSON.stringify( req_body ),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
  })
}

/**
 * @typedef {object} Message The body of the request to the OpenAI API
 * @property {string} role the role of the message
 * @property {any} content the content of the message
 */

/**
 * Given a chat conversation, the model will return a chat completion response.
 *
 * @param {object} params The body of the request to the OpenAI API
 * @param {Message[]}params.messages The messages to send to the OpenAI API
 * @param {string} params.model The model to use
 * @param {string} params.stream Whether to stream back partial progress.
 */
export async function getChatCompletionResponse({
  messages,
  model,
  stream,
}) {
  return fetch( `${OPENAI_API_BASE_URL}/chat/completions`, {
    method: 'POST',
    body: JSON.stringify({ model, messages, stream }),
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
  })
}

/**
 * Given a prompt and/or an input image, the model will generate a new image.
 *
 * @param {object } req_body The body of the request to the OpenAI API
 */
export async function getImageGenerationsResponse({
  n,
  size,
  user,
  prompt,
  response_format,
}) {
  return fetch( `${OPENAI_API_BASE_URL}/images/generations`, {
    method: 'POST',
    body: JSON.stringify({ n, size, user, prompt, response_format }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
  })
}

/**
 * Given a prompt and/or an input image, the model will generate a new image.
 *
 * @param {object } req_body The body of the request to the OpenAI API
 */
export async function getEmbeddedResponse({ user, input, model }) {
  return fetch( `${OPENAI_API_BASE_URL}/embeddings`, {
    method: 'POST',
    body: JSON.stringify({ user, input, model }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${OPENAI_API_KEY}`,
    },
  })
}
