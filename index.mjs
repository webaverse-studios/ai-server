// import path from 'path';
// import http from 'http';
// import https from 'https';
import fs from 'fs';
// import child_process from 'child_process';

import express from 'express';
// import * as vite from 'vite';
import dotenv from 'dotenv';

import {AiServer} from './servers/ai-server.js';

// import {
//   COMPILER_NAME,
//   IMAGE_NAME,
//   RENDERER_NAME,
//   WIKI_NAME,
//   AI_HOST,
//   AI2_HOST,
//   SERVER_NAME,
//   PORTS,
// } from './servers/server-constants.mjs';
import {isHttps, makeHttpServer} from './servers/server-utils.mjs';

//

const port = parseInt(process.env.PORT, 10) || 80;

//

dotenv.config();
const {OPENAI_API_KEY, ELEVEN_LABS_API_KEY} = process.env;
if (!OPENAI_API_KEY) {
  throw new Error('backend missing OPENAI_API_KEY');
}
if (!ELEVEN_LABS_API_KEY) {
  throw new Error('backend missing ELEVEN_LABS_API_KEY');
}
// process.env.VITE_OPENAI_API_KEY = OPENAI_API_KEY;
// process.env.VITE_ELEVEN_LABS_API_KEY = ELEVEN_LABS_API_KEY;

// const isProduction = process.env.NODE_ENV === 'production';
const vercelJson = JSON.parse(fs.readFileSync('./vercel.json', 'utf8'));

const aiServer = new AiServer({
  apiKey: OPENAI_API_KEY,
  elevenLabsApiKey: ELEVEN_LABS_API_KEY,
});

//

const tmpDir = `/tmp/webaverse-dev-server`;
fs.mkdirSync(tmpDir, {
  recursive: true,
});

const {headers: headerSpecs} = vercelJson;
const headerSpec0 = headerSpecs[0];
const {headers} = headerSpec0;
const _setHeaders = res => {
  for (const {key, value} of headers) {
    res.setHeader(key, value);
  }
};

/* const _proxyUrl = (req, res, url) => {
  const {method} = req;
  const opts = {
    method,
  };

  const proxyReq = /^https:/.test(url)
    ? https.request(url, opts)
    : http.request(url, opts);

  for (const header in req.headers) {
    proxyReq.setHeader(header, req.headers[header]);
  }

  proxyReq.on('response', proxyRes => {
    for (const header in proxyRes.headers) {
      res.setHeader(header, proxyRes.headers[header]);
    }
    res.statusCode = proxyRes.statusCode;
    proxyRes.pipe(res);
  });

  proxyReq.on('error', err => {
    console.error(err);
    res.statusCode = 500;
    res.end();
  });

  if (['POST', 'PUT', 'DELETE'].includes(method)) {
    req.pipe(proxyReq);
  } else {
    proxyReq.end();
  }
};

const _proxyTmp = (req, res) => {
  const url = new URL(req.url);
  const urlPath = path.join(tmpDir, url.pathname.replace(/^\/tmp\//, ''));

  if (req.method === 'GET') {
    const rs = fs.createReadStream(urlPath);
    rs.on('error', err => {
      console.warn(err);
      res.statusCode = 500;
      res.end(err.stack);
    });
    rs.pipe(res);
  } else if (['PUT', 'POST'].includes(req.method)) {
    const ws = fs.createWriteStream(urlPath);
    ws.on('error', err => {
      console.warn(err);
      res.statusCode = 500;
      res.end(err.stack);
    });
    ws.on('finish', () => {
      res.end();
    });
    req.pipe(ws);
  } else {
    res.statusCode = 400;
    res.end('not implemented');
  }
}; */

(async () => {
  const app = express();
  app.all('*', async (req, res, next) => {
    _setHeaders(res);

    // const hostname = req.headers.host.replace(/:.*$/, '');

    if (req.method === 'OPTIONS') {
      res.end();
    } else if (
      [
        '/api/ai/',
        // '/api/image-ai/',
        // '/api/chat/completions',
        // '/api/audio/transcriptions',
      ].some(prefix => req.url.startsWith(prefix))
    ) {
      await aiServer.handleRequest(req, res);
    // } else if (['/api/youtube/'].some(prefix => req.url.startsWith(prefix))) {
    //   await youtubeServer.handleRequest(req, res);
    } else {
      next();
    }
  });

  const httpServer = makeHttpServer(app);
  // const viteServer = await vite.createServer({
  //   mode: isProduction ? 'production' : 'development',
  //   server: {
  //     middlewareMode: true,
  //     hmr: {
  //       server: httpServer,
  //       port,
  //     },
  //   },
  // });
  // app.use(viteServer.middlewares);

  await /** @type {Promise<void>} */ (
    new Promise((resolve, reject) => {
      httpServer.listen(port, '0.0.0.0', () => {
        resolve();
      });

      httpServer.on('error', reject);
    })
  );

  console.log(
    `  > Local dev server: http${isHttps() ? 's' : ''}://0.0.0.0:${
      port
    }/`,
  );
})();

process.on('disconnect', function () {
  console.log('dev-server parent exited');
  process.exit();
});
process.on('SIGINT', function () {
  console.log('ai-server SIGINT');
  // databaseServer.destroy();
  process.exit();
});
