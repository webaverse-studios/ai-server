# AI Server

This is a simple REST API server to handle requests for
OpenAI Whisper and Eleven labs text-to-speech.

## Install

    yarn install

## Run the app

    yarn dev

### REST API

The REST API to the example app is described below.

### Get list of Things

#### Request

`POST /tts`

    curl --request POST \
    --url http://localhost:8000/tts \
    --header 'Content-Type: application/json' \
    --data '{
        "text": "this is a string"
    }'

#### Response

    HTTP/1.1 200 OK
    Date: Fri, 7 April 2023 12:00:00 GMT
    Status: 200 OK
    X-Powered-By: Express
    access-control-allow-headers: *
    access-control-allow-methods: POST, OPTIONS, DELETE, GET
    access-control-allow-origin: *
    access-control-expose-headers: request_id
    alt-svc: h3=":443"; ma=2592000,h3-29=":443"; ma=2592000
    connection: close
    content-type: audio/mpeg
    date: Fri, 07 Apr 2023 15:02:12 GMT
    request_id: c77453ad1bf045d28565fdb96f3ba856
    server: uvicorn
    transfer-encoding: chunked
    via: 1.1 google

    <audio stream>

### Speech to Text transcriptions

#### Request

`POST /stt`

    curl --request POST \
    --url http://localhost:8000/sst \
    --header 'Content-Type: application/x-www-form-urlencoded' \
    --data 'file=<audio stream>'

#### Response

    HTTP/1.1 200 OK
    Date: Fri, 7 April 2023 12:00:00 GMT
    Status: 200 OK
    X-Powered-By: Express
    access-control-allow-headers: *
    access-control-allow-methods: POST, OPTIONS, DELETE, GET
    access-control-allow-origin: *
    access-control-expose-headers: request_id
    alt-svc: h3=":443"; ma=2592000,h3-29=":443"; ma=2592000
    connection: close
    content-type: audio/mpeg
    date: Fri, 07 Apr 2023 15:02:12 GMT
    request_id: c77453ad1bf045d28565fdb96f3ba856
    server: uvicorn
    transfer-encoding: chunked
    via: 1.1 google

    <audio stream>
