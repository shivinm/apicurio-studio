import * as express from 'express';
import * as fallback from 'express-history-api-fallback';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import * as openResource from 'open';
import { join, resolve } from 'path';

import Config from '../../config';
import * as codeChangeTool from './code_change_tools';

const plugins = <any>gulpLoadPlugins();

/**
 * Serves the Single Page Application. More specifically, calls the `listen` method, which itself launches BrowserSync.
 */
export function serveSPA() {
  codeChangeTool.listen();
}

/**
 * This utility method is used to notify that a file change has happened and subsequently calls the `changed` method,
 * which itself initiates a BrowserSync reload.
 * @param {any} e - The file that has changed.
 */
export function notifyLiveReload(e: any) {
  const fileName = e.path;
  codeChangeTool.changed(fileName);
}

/**
 * This utility method is used to watch for the current project files
 * and doing a callback upon change
 */
export function watchAppFiles(path: string, fileChangeCallback: (e: any, done: () => void) => void) {
  const paths: string[] = [
    join(Config.APP_SRC, path)
  ].concat(Config.TEMP_FILES.map((p) => { return '!' + p; }));

  let busyWithCall = false;
  let changesWaiting: any = null;
  const afterCall = () => {
    busyWithCall = false;
    if (changesWaiting) {
      fileChangeCallback(changesWaiting, afterCall);
      changesWaiting = null;
    }
  };
  plugins.watch(paths, (e: any) => {
    if (busyWithCall) {
      changesWaiting = e;
      return;
    }
    busyWithCall = true;
    fileChangeCallback(e, afterCall);
  });
}

/**
 * Starts a new `express` server, serving the static documentation files.
 */
export function serveDocs() {
  const server = express();

  server.use(
    Config.APP_BASE,
    express.static(resolve(process.cwd(), Config.DOCS_DEST))
  );

  server.listen(Config.DOCS_PORT, () =>
    openResource(getResourceUrl(Config.DOCS_PORT))
  );
}

/**
 * Starts a new `express` server, serving the built files from `dist/prod`.
 */
export function serveProd() {
  const root = resolve(process.cwd(), Config.PROD_DEST);
  const server = express();

  for (const proxy of Config.PROXY_MIDDLEWARE) {
    server.use(proxy);
  }

  server.use(Config.APP_BASE, express.static(root));

  server.use(fallback('index.html', { root }));

  server.listen(Config.PORT, () =>
    openResource(getResourceUrl(Config.PORT))
  );
}

function getResourceUrl(port: number) {
  return `http://localhost:${port}${Config.APP_BASE}`;
}
