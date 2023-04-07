import express from 'express'

import {
  errorLogger,
  errorResponder,
  invalidPathHandler,
} from './middleware/errorHandler.mjs'
import { sttHandler, ttsHandler } from './routes/index.mjs'

const app = express()
const port = 3000

app.use( express.json())
app.use( express.urlencoded({ extended: true }))

// ELEVEN-LABS
app.post( '/tts', ttsHandler )
// Whisper
app.post( '/stt', sttHandler )

// Attach the first Error handling Middleware
// function defined above (which logs the error)
app.use( errorLogger )

// Attach the second Error handling Middleware
// function defined above (which sends back the response)
app.use( errorResponder )

// Attach the fallback Middleware
// function which sends back the response for invalid paths)
app.use( invalidPathHandler )

app.listen( port, () => {
  // eslint-disable-next-line no-console
  console.log( `Example app listening on port ${port}` )
})
