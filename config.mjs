import { config } from 'dotenv'
config()

export const OPENAI_API_BASE_URL = 'https://api.openai.com/v1'
export const ELEVEN_LABS_BASE_URL =
  'https://api.elevenlabs.io/v1/text-to-speech'

export const PORT = process.env['PORT'] ?? 8000
export const OPENAI_API_KEY = process.env['OPENAI_API_KEY'] ?? ''
export const ELEVEN_LABS_API_KEY = process.env['ELEVEN_LABS_API_KEY'] ?? ''
