import {
  ApplicationConfig,
  VERSION,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { initFederation } from '@angular-architects/module-federation-runtime/enhanced';
import type { UserOptions } from '@module-federation/runtime-core';
import * as AngularCommon from '@angular/common';
import * as AngularCompiler from '@angular/compiler';
import * as AngularCore from '@angular/core';
import * as AngularForms from '@angular/forms';
import * as AngularRouter from '@angular/router';
import * as RxJS from 'rxjs';

import { routes } from './app.routes';
import {
  buildMicroFrontendManifest,
  loadMicroFrontendRoutes,
} from './config/micro-frontend-routes';

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
    provideHttpClient(),
    provideAppInitializer(async () => {
      await loadMicroFrontendRoutes();

      return initFederation(buildMicroFrontendManifest(), {
        runtimeOptions: sharedRuntimeOptions as UserOptions,
      });
    }),
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
