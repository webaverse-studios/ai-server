import express from 'express'

import { PORT } from './config.mjs'
import { sttHandler, ttsHandler } from './routes/index.mjs'

const app = express()

app.use( express.json())
app.use( express.urlencoded({ extended: true }))

// ELEVEN-LABS
app.post( '/tts', ttsHandler )
// Whisper
app.post( '/stt', sttHandler )

app.listen( PORT, () => {
  // eslint-disable-next-line no-console
  console.log( `Example app listening on port ${PORT}` )
})
