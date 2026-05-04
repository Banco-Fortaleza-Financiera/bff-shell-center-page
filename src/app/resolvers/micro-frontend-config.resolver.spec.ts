import { convertToParamMap } from '@angular/router';

import { microFrontendConfigResolver } from './micro-frontend-config.resolver';
import { getMicroFrontendByPath } from '../config/micro-frontend-routes';

jest.mock('../config/micro-frontend-routes', () => ({
  getMicroFrontendByPath: jest.fn(),
}));

describe('microFrontendConfigResolver', () => {
  const route = {
    paramMap: convertToParamMap({ microFrontendPath: 'users' }),
  } as any;

  beforeEach(() => {
    jest.mocked(getMicroFrontendByPath).mockReset();
  });

  it('should return the config for the route path', () => {
    const config = { path: 'users', name: 'users' };
    jest.mocked(getMicroFrontendByPath).mockReturnValue(config as any);

    expect(microFrontendConfigResolver(route, {} as any)).toBe(config);
  });

  it('should fail when the route path does not have config', () => {
    jest.mocked(getMicroFrontendByPath).mockReturnValue(undefined);

    expect(() => microFrontendConfigResolver(route, {} as any)).toThrow(
      'Configuración de micro frontend no encontrada'
    );
  });
});
