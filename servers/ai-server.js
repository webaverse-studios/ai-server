// import dotenv from 'dotenv';
// import {Configuration, OpenAIApi} from 'openai';
// import {getFormData} from '../utils/http-utils.js';
// import {blob2img} from '../utils/convert-utils.js';
import {
  Readable,
} from 'stream';

// const configuration = new Configuration({
//   apiKey: OPENAI_API_KEY,
//   // formDataCtor: FormData,
// });
// const openai = new OpenAIApi(configuration);

//

const createImageBlob = async (prompt, {
  n = 1,
  size = '1024x1024',
  apiKey,
}) => {
  // const response = await openai.createImage({
  //   prompt,
  //   n: 1,
  //   size: "1024x1024",
  // });
  const res = await fetch(`https://api.openai.com/v1/images/generations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt,
      n,
      size,
    }),
  });
  const responseData = await res.json();
  if (!res.ok) {
    console.log('got error response', res.ok, res.status, responseData);
  }
  const image_url = responseData.data[0].url;

  const res2 = await fetch(image_url);
  const blob = await res2.blob();
  return blob;
};

const editRequestBlob = async (req, {
  apiKey,
}) => {
  // console.log('req 1', new Error().stack);
  const contentType = req.headers['content-type'];
  // console.log('req 2');
  const response = await fetch(`https://api.openai.com/v1/images/edits`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': contentType,
    },
    // pipe the node stream to the fetch body
    body: req,
    duplex: 'half',
  });
  if (response.ok) {
    const responseData = await response.json();
    let image_url = responseData.data[0].url;

    const res = await fetch(image_url);
    const blob = await res.blob();
    return blob;
  } else {
    const text = await response.text();
    console.warn('got error response', text, response.headers);
    throw new Error(text);
  }
};

export class AiServer {
  constructor({
    apiKey,
    elevenLabsApiKey,
  }) {
    if (!apiKey) {
      console.warn('ai server got no api key');
      debugger;
    }

    this.apiKey = apiKey;
    this.elevenLabsApiKey = elevenLabsApiKey;
  }
  async handleRequest(req, res) {
    try {
      // console.log('ai server handle request yyy', req.url);

      let match;
      if (match = req.url.match(/^\/api\/ai\/(chat\/completions|completions|embeddings|images\/generations)/)) {

        const sub = match[1];

        // console.log('match 1', match);

        /* {
          "model": "gpt-3.5-turbo",
          "messages": [{"role": "user", "content": "Hello!"}]
        } */        

        const proxyRes = await fetch(`https://api.openai.com/v1/${sub}`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          // pipe the node request to the fetch body
          body: req,
          duplex: 'half',
        });

        if (proxyRes.ok) {
          // console.log('got ok');
          if (sub !== 'images/generations') {
            // pipe the proxy response web stream to the nodejs response stream
            Readable.fromWeb(proxyRes.body).pipe(res);
          } else {
            const j = await proxyRes.json();
            const url2 = j?.data?.[0]?.url;
            const proxyRes2 = await fetch(url2);
            if (proxyRes2.ok) {
              // pipe the proxy response web stream to the nodejs response stream
              Readable.fromWeb(proxyRes2.body).pipe(res);
            } else {
              const text = await proxyRes2.text();
              console.warn('got generations api error response', text);
              res.status(500).send(text);
            }
          }
        } else {
          const text = await proxyRes.text();
          console.warn('got api error response', text);
          res.status(500).send(text);
        }
      } else if (match = req.url.match(/^\/api\/ai\/(audio\/transcriptions)/)) {
        // console.log('proxy audio');

        const sub = match[1];

        console.log('post', `https://api.openai.com/v1/${sub}`);

        console.log('request headers', req.headers);

        const proxyRes = await fetch(`https://api.openai.com/v1/${sub}`, {
          method: req.method,
          headers: {
            // ...req.headers,
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': req.headers['content-type'],
            'Content-Length': req.headers['content-length'],
            'User-Agent': req.headers['user-agent'],
            'Accept': req.headers['accept'],
          },
          // pipe the node request to the fetch body
          body: req,
          duplex: 'half',
        });

        if (proxyRes.ok) {
          // proxy status
          res.status(proxyRes.status);
          // proxy headers
          [
            'content-type',
            'content-length',
          ].forEach(name => {
            const value = proxyRes.headers.get(name);
            if (value) {
              res.setHeader(name, value);
            }
          });
          // pipe the proxy response web stream to the nodejs response stream
          Readable.fromWeb(proxyRes.body).pipe(res);
        } else {
          const text = await proxyRes.text();
          console.warn('got api error response', text);
          res.status(500).send(text);
        }
      } else if (match = req.url.match(/^\/api\/ai\/(text-to-speech(?:\/.*)?)/)) {
        const sub = match[1];
        // console.log('proxy text-to-speech');

        // console.log('post', `https://api.openai.com/v1/${sub}`);
        // console.log('request headers', req.headers);

        const proxyRes = await fetch(`https://api.elevenlabs.io/v1/${sub}`, {
          method: req.method,
          headers: {
            // ...req.headers,
            'xi-api-key': this.elevenLabsApiKey,
            'Content-Type': req.headers['content-type'],
            'Content-Length': req.headers['content-length'],
            'User-Agent': req.headers['user-agent'],
            'Accept': req.headers['accept'],
          },
          // pipe the node request to the fetch body
          body: req,
          duplex: 'half',
        });

        if (proxyRes.ok) {
          // proxy status
          res.status(proxyRes.status);
          // proxy headers
          [
            'content-type',
            'content-length',
          ].forEach(name => {
            const value = proxyRes.headers.get(name);
            if (value) {
              res.setHeader(name, value);
            }
          });
          // pipe the proxy response web stream to the nodejs response stream
          Readable.fromWeb(proxyRes.body).pipe(res);
        } else {
          const text = await proxyRes.text();
          console.warn('got api error response', text);
          res.status(500).send(text);
        }
      } else if (match = req.url.match(/^\/api\/image-ai\/([^\/\?]+)/)) {
        throw new Error('should not be used');

        const method = match[1];

        // console.log('match 2', match);

        switch (method) {
          case 'createImageBlob': {
            // read query string
            const {prompt, n, size} = req.query;
            const blob = await createImageBlob(prompt, {
              n,
              size,
              apiKey: this.apiKey,
            });
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            res.setHeader('Content-Type', blob.type);
            res.end(buffer);
            break;
          }
          case 'editImgBlob': {
            const blob = await editRequestBlob(req, {
              apiKey: this.apiKey,
            });
            const arrayBuffer = await blob.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            res.setHeader('Content-Type', blob.type);
            res.end(buffer);
            break;
          }
          default: {
            console.warn('method not found', method);
            res.send(404);
            break;
          }
        }
      } else {
        console.warn('image client had no url match', req.url);
        res.send(404);
      }
    } catch (err) {
      console.warn('ai client error', err);
      res.status(500).send(err.stack);
    }
  }
}