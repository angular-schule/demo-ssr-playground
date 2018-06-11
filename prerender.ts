// These are important and needed before anything else
import 'zone.js/dist/zone-node';
import 'reflect-metadata';

import * as express from 'express';
import { join } from 'path';
import { readFileSync } from 'fs';
import { renderModuleFactory } from '@angular/platform-server';
import { renderModuleFactoryMany } from './server-utils';


const DIST_FOLDER = join(process.cwd(), 'dist');

const { AppServerModuleNgFactory } = require('./dist/ssr-playground-server/main');

const routes = [
  '/',
  '/dashboard',
  '/item/bed',
  '/item/book',
  '/item/garden',
];

renderModuleFactoryMany(AppServerModuleNgFactory, {
  document: readFileSync(join(DIST_FOLDER, 'ssr-playground', 'index.html')).toString()
}, routes).then(html => console.log(html));
