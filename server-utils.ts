// THIS IS A MODIFIED COPY FROM
// https://github.com/angular/angular/blob/6.0.4/packages/platform-server/src/utils.ts

/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as promiseSerial from 'promise-serial';

import {ApplicationRef, NgModuleFactory, NgModuleRef, PlatformRef, StaticProvider, Type} from '@angular/core';
import {ɵTRANSITION_ID} from '@angular/platform-browser';
import {first} from 'rxjs/operators';

import {PlatformState} from '@angular/platform-server';
import {platformDynamicServer, platformServer} from '@angular/platform-server';
import {BEFORE_APP_SERIALIZED, INITIAL_CONFIG} from '@angular/platform-server';
import { Router } from '@angular/router';

interface PlatformOptions {
  document?: string;
  url?: string;
  extraProviders?: StaticProvider[];
}

function _getPlatform(
    platformFactory: (extraProviders: StaticProvider[]) => PlatformRef,
    options: PlatformOptions): PlatformRef {
  const extraProviders = options.extraProviders ? options.extraProviders : [];
  return platformFactory([
    {provide: INITIAL_CONFIG, useValue: {document: options.document, url: options.url}},
    extraProviders
  ]);
}

function _render<T>(
    platform: PlatformRef, moduleRefPromise: Promise<NgModuleRef<T>>, urls: string[]): Promise<string[]> {
  return moduleRefPromise.then((moduleRef) => {
    const transitionId = moduleRef.injector.get(ɵTRANSITION_ID, null);
    if (!transitionId) {
      throw new Error(
          `renderModule[Factory]() requires the use of BrowserModule.withServerTransition() to ensure
the server-rendered app can be properly bootstrapped into a client app.`);
    }
    const applicationRef: ApplicationRef = moduleRef.injector.get(ApplicationRef);
    return applicationRef.isStable.pipe((first((isStable: boolean) => isStable)))
        .toPromise()
        .then(() => {
          // Run any BEFORE_APP_SERIALIZED callbacks just before rendering to string.
          const callbacks = moduleRef.injector.get(BEFORE_APP_SERIALIZED, null);
          if (callbacks) {
            for (const callback of callbacks) {
              try {
                callback();
              } catch (e) {
                // Ignore exceptions.
                console.warn('Ignoring BEFORE_APP_SERIALIZED Exception: ', e);
              }
            }
          }

          const platformState = platform.injector.get(PlatformState);
          const router: Router = moduleRef.injector.get(Router);

          const renderedRoutes = urls.map(url => () => {
            return router.navigateByUrl(url)
              .then(() => {
                applicationRef.tick();
                return platformState.renderToString();
              });
          });

          return promiseSerial(renderedRoutes).then(results => {
            platform.destroy();
            return results;
          });
        });
  });
}



/**
 * Renders a Module to string.
 *
 * `document` is the full document HTML of the page to render, as a string.
 * `url` is the URL for the current render request.
 * `extraProviders` are the platform level providers for the current render request.
 *
 * Do not use this in a production server environment. Use pre-compiled {@link NgModuleFactory} with
 * {@link renderModuleFactory} instead.
 *
 * @experimental
 */
export function renderModule<T>(
    module: Type<T>, options: {document?: string, extraProviders?: StaticProvider[]}, urls: string[]):
    Promise<string[]> {
  const platform = _getPlatform(platformDynamicServer, { ...options, url: urls[0] });
  return _render(platform, platform.bootstrapModule(module), urls);
}

/**
 * Renders a {@link NgModuleFactory} to string.
 *
 * `document` is the full document HTML of the page to render, as a string.
 * `url` is the URL for the current render request.
 * `extraProviders` are the platform level providers for the current render request.
 *
 * @experimental
 */
export function renderModuleFactoryMany<T>(
    moduleFactory: NgModuleFactory<T>,
    options: {document?: string, extraProviders?: StaticProvider[]},
    urls: string[]):
    Promise<string[]> {
  const platform = _getPlatform(platformServer, { ...options, url: urls[0] });
  return _render(platform, platform.bootstrapModuleFactory(moduleFactory), urls);
}
