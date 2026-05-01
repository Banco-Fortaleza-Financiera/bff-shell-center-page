import {
  ApplicationConfig,
  VERSION,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { initFederation } from '@angular-architects/module-federation-runtime/enhanced';
import type { ManifestFile } from '@angular-architects/module-federation-runtime/enhanced';
import type { UserOptions } from '@module-federation/runtime-core';
import * as AngularCommon from '@angular/common';
import * as AngularCompiler from '@angular/compiler';
import * as AngularCore from '@angular/core';
import * as AngularForms from '@angular/forms';
import * as AngularRouter from '@angular/router';
import * as RxJS from 'rxjs';

import { routes } from './app.routes';
import { MICRO_FRONTENDS } from './config/micro-frontend-routes';

const mfManifest: ManifestFile = Object.fromEntries(
  MICRO_FRONTENDS.map((mf) => [
    mf.name,
    {
      name: mf.name,
      type: 'module',
      remoteEntry: mf.remoteEntry,
    },
  ])
);

const sharedRuntimeOptions = {
  shared: {
    '@angular/core': sharedAngular(AngularCore),
    '@angular/common': sharedAngular(AngularCommon),
    '@angular/compiler': sharedAngular(AngularCompiler),
    '@angular/forms': sharedAngular(AngularForms),
    '@angular/router': sharedAngular(AngularRouter),
    rxjs: {
      version: '7.8.0',
      lib: () => RxJS,
      loaded: true,
      shareConfig: {
        singleton: true,
        strictVersion: false,
        requiredVersion: false as const,
      },
    },
  },
} as Partial<UserOptions>;

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(() =>
      initFederation(mfManifest, {
        runtimeOptions: sharedRuntimeOptions as UserOptions,
      })
    ),
    provideRouter(routes),
  ],
};

function sharedAngular(lib: unknown) {
  return {
    version: VERSION.full,
    lib: () => lib,
    loaded: true,
    shareConfig: {
      singleton: true,
      strictVersion: false,
      requiredVersion: false as const,
    },
  };
}
