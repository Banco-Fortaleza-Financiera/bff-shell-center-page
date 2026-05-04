import type { ManifestFile } from '@angular-architects/module-federation-runtime/enhanced';

import { environment } from '../../environments/environment';
import { MicroFrontendConfig } from '../interfaces/micro-frontend-config.interface';

let microFrontends: MicroFrontendConfig[] = [];

export async function loadMicroFrontendRoutes(): Promise<MicroFrontendConfig[]> {
  const response = await fetch(getConfigUrl(), {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`No se pudo cargar la configuración MFA: ${environment.mfaConfigFile}`);
  }

  const config = (await response.json()) as unknown;

  if (!Array.isArray(config)) {
    throw new Error('La configuración MFA debe ser un arreglo de micro frontends.');
  }

  microFrontends = config as MicroFrontendConfig[];

  return microFrontends;
}

function getConfigUrl(): string {
  const separator = environment.mfaConfigFile.includes('?') ? '&' : '?';

  return `${environment.mfaConfigFile}${separator}v=${Date.now()}`;
}

export function getMicroFrontends(): MicroFrontendConfig[] {
  return microFrontends;
}

export function getMicroFrontendByPath(path: string): MicroFrontendConfig | undefined {
  return microFrontends.find((mf) => mf.path === path);
}

export function getDefaultMicroFrontendPath(): string {
  return microFrontends[0]?.path ?? 'login';
}

export function buildMicroFrontendManifest(): ManifestFile {
  return Object.fromEntries(
    microFrontends.map((mf) => [
      mf.name,
      {
        name: mf.name,
        type: 'module',
        remoteEntry: mf.remoteEntry,
      },
    ])
  );
}
