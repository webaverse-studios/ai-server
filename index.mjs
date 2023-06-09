import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import multer from 'multer'

import { PORT } from './config.mjs'
import { openAIHandler, ttsHandler } from './routes/index.mjs'
import { OPEN_AI_METHOD } from './routes/open-ai.mjs'

const app = express()
const upload = multer()

app.use( cors())
app.use( express.json())
app.use( express.urlencoded({ extended: true }))
app.use( morgan( 'combined' ))

// ELEVEN-LABS
app.post( '/tts/:voiceId/stream', ttsHandler )

// Open AI
app.post( '/completions', ( req, res ) =>
  openAIHandler( req, res, OPEN_AI_METHOD.COMPLETION )
)
app.post( '/chat/completions', ( req, res ) =>
  openAIHandler( req, res, OPEN_AI_METHOD.CHAT_COMPLETION )
)
app.post( '/images/generations', ( req, res ) =>
  openAIHandler( req, res, OPEN_AI_METHOD.IMAGES_GENERATION )
)
app.post( '/embeddings', ( req, res ) =>
  openAIHandler( req, res, OPEN_AI_METHOD.EMBEDDINGS )
)
app.post( '/audio/transcriptions', upload.any(), ( req, res ) =>
  openAIHandler( req, res, OPEN_AI_METHOD.STT )
)

app.listen( PORT, () => {
  // eslint-disable-next-line no-console
  console.log( `AI Server listening on port ${PORT}` )
})
