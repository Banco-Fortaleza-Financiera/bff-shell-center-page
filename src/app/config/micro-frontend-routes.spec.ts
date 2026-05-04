import {
  buildMicroFrontendManifest,
  getDefaultMicroFrontendPath,
  getMicroFrontendByPath,
  getMicroFrontends,
  loadMicroFrontendRoutes,
} from './micro-frontend-routes';

describe('micro-frontend-routes', () => {
  const routes = [
    {
      name: 'users',
      displayName: 'Users',
      remoteEntry: 'http://localhost:4201/remoteEntry.js',
      exposedModule: './UsersComponent',
      componentName: 'UsersComponent',
      path: 'users',
    },
  ];

  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(123);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should load and expose the micro frontend routes', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(routes),
    } as Response);

    await expect(loadMicroFrontendRoutes()).resolves.toEqual(routes);

    expect(fetch).toHaveBeenCalledWith('assets/mfa/mfa.local.json?v=123', {
      cache: 'no-store',
    });
    expect(getMicroFrontends()).toEqual(routes);
    expect(getMicroFrontendByPath('users')).toEqual(routes[0]);
    expect(getDefaultMicroFrontendPath()).toBe('users');
    expect(buildMicroFrontendManifest()).toEqual({
      users: {
        name: 'users',
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
      },
    });
  });

  it('should add the cache parameter with ampersand when the URL already has params', async () => {
    const originalConfigFile = 'assets/mfa/mfa.local.json';
    const environmentModule = await import('../../environments/environment');
    environmentModule.environment.mfaConfigFile = 'assets/mfa/mfa.local.json?env=local';
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(routes),
    } as Response);

    await loadMicroFrontendRoutes();

    expect(fetch).toHaveBeenCalledWith('assets/mfa/mfa.local.json?env=local&v=123', {
      cache: 'no-store',
    });

    environmentModule.environment.mfaConfigFile = originalConfigFile;
  });

  it('should fail when the routes request is not successful', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
    } as Response);

    await expect(loadMicroFrontendRoutes()).rejects.toThrow(
      'No se pudo cargar la configuración MFA'
    );
  });

  it('should fail when the config is not a list', async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ name: 'users' }),
    } as Response);

    await expect(loadMicroFrontendRoutes()).rejects.toThrow(
      'La configuración MFA debe ser un arreglo'
    );
  });
});
