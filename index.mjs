import express from 'express'
import multer from 'multer'

import { PORT } from './config.mjs'
import {
  chatCompletionHandler,
  sttHandler,
  ttsHandler,
} from './routes/index.mjs'

const app = express()
const upload = multer()

app.use( express.json())
app.use( express.urlencoded({ extended: true }))

// ELEVEN-LABS
app.post( '/tts/:voiceId', ttsHandler )

// Whisper
app.post( '/stt', upload.any(), sttHandler )

app.post( '/chat/completions', chatCompletionHandler )

app.listen( PORT, () => {
  // eslint-disable-next-line no-console
  console.log( `AI Server listening on port ${PORT}` )
})
