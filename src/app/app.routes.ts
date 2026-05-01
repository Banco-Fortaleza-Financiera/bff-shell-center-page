import { Routes } from '@angular/router';
import { loadRemoteModule } from '@angular-architects/module-federation-runtime/enhanced';
import { MICRO_FRONTENDS } from './config/micro-frontend-routes';

type MicroFrontend = (typeof MICRO_FRONTENDS)[number];

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'users',
    pathMatch: 'full',
  },
  ...MICRO_FRONTENDS.map((mf) => ({
    path: mf.path,
    loadComponent: () => loadMicroFrontendComponent(mf),
  })),
  {
    path: '**',
    redirectTo: 'users',
  },
];

async function loadMicroFrontendComponent(mf: MicroFrontend) {
  try {
    const remote = await loadRemoteModule({
      remoteName: mf.name,
      exposedModule: mf.exposedModule,
    });

    return remote[mf.componentName];
  } catch (error) {
    if (!mf.fallbackExposedModule) {
      throw error;
    }

    const remote = await loadRemoteModule({
      remoteName: mf.name,
      exposedModule: mf.fallbackExposedModule,
    });

    return remote[mf.componentName];
  }
}
