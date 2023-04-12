import path from 'path';
import os from 'os';
import {tryReadFile} from './server-utils.mjs';

let metaUrl = decodeURI(import.meta.url).replace('file://', '');
if (os.platform() === 'win32') {
  metaUrl = metaUrl.replace(/^[\/\\]+/, '');
}
export const BASE_DIRNAME = path.normalize(
  path.join(metaUrl, '..', '..'),
);

export const SERVER_NAME = 'local.webaverse.com';
export const COMPILER_NAME = 'local.webaverse.live';
export const IMAGE_NAME = 'local-image.webaverse.com';
export const RENDERER_NAME = 'local-renderer.webaverse.com';
export const WIKI_NAME = 'local-wiki.webaverse.com';
export const AI_HOST = 'llama-server.webaverse.com';
export const AI2_HOST = 'ai-server.webaverse.com';

export const HOST = process.env.HOST || '0.0.0.0';
export const HTTPS_CERT = './certs-local/fullchain.pem';
export const HTTPS_KEY = './certs-local/privkey.pem';

export const PORTS = {
  DEV: 4443,
  MULTIPLAYER: 2222,
  IMAGE: 1111,
  COMPILER: 3333,
  WIKI: 4444,
  OCR: 5444,
  VQA: 5445,
  DOCTR: 5446,
  BLIP2: 5447,
  SEGMENTATION: 8111,
  RENDERER: 5555,
  MASK2FORMER: 6666,
  DEPTH: 7777,
  MIDASDEPTH: 7779,
  ZOEDEPTH: 7780,
  WEBSOCKET_PROXY: 8001,
  GUN: 8765,
  TTS: 8888,
  IRN: 9998,
  GEN: 9999,
};

/**
 * @type {import('tls').SecureContextOptions}
 */
export const CERTIFICATES = {
  key:
    tryReadFile(path.join(BASE_DIRNAME, 'certs/privkey.pem')) ||
    tryReadFile(path.join(BASE_DIRNAME, 'certs-local/privkey.pem')) || "",
  cert:
    tryReadFile(path.join(BASE_DIRNAME, 'certs/fullchain.pem')) ||
    tryReadFile(path.join(BASE_DIRNAME, 'certs-local/fullchain.pem')) || "",
};
