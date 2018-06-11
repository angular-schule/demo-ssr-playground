// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import * as express from 'express';
import { join } from 'path';
import { ngExpressEngine } from '@nguniversal/express-engine';

// Express server
const app = express();

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist');

const { AppServerModuleNgFactory } = require('./dist/ssr-playground-server/main');

app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory
}));

app.set('view engine', 'html');
app.set('views', join(DIST_FOLDER, 'ssr-playground'));

// Serve static files
// app.get('*.*', express.static(join(DIST_FOLDER, 'ssr-playground')));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  res.render('index', { req });
});

app.listen(PORT, () => {
  console.log(`Node server listening on http://localhost:${PORT}`);
});
