import { ResolveFn } from '@angular/router';

import { getMicroFrontendByPath } from '../config/micro-frontend-routes';
import { MicroFrontendConfig } from '../interfaces/micro-frontend-config.interface';

export const microFrontendConfigResolver: ResolveFn<MicroFrontendConfig> = (route) => {
  const path = route.paramMap.get('microFrontendPath') ?? '';
  const config = getMicroFrontendByPath(path);

  if (!config) {
    throw new Error(`Configuración de micro frontend no encontrada para la ruta: ${path}`);
  }

  return config;
};
