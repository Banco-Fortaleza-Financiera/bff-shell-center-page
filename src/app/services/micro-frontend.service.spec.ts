import { TestBed } from '@angular/core/testing';
import { loadRemoteModule } from '@angular-architects/module-federation-runtime/enhanced';
import { MicroFrontendService } from './micro-frontend.service';

jest.mock('@angular-architects/module-federation-runtime/enhanced', () => ({
  loadRemoteModule: jest.fn(),
}));

describe('MicroFrontendService', () => {
  let service: MicroFrontendService;
  const loadRemoteModuleMock = loadRemoteModule as jest.Mock;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MicroFrontendService);
    loadRemoteModuleMock.mockReset();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should load a remote module with the provided configuration', async () => {
    const remoteModule = { UsersListComponent: class UsersListComponent {} };
    loadRemoteModuleMock.mockResolvedValue(remoteModule);

    const result = await service.loadModule('bffMfaUsers', './UsersListComponent');

    expect(result).toBe(remoteModule);
    expect(loadRemoteModuleMock).toHaveBeenCalledWith({
      remoteName: 'bffMfaUsers',
      exposedModule: './UsersListComponent',
    });
  });

  it('should rethrow errors when the remote module cannot be loaded', async () => {
    const error = new Error('remote unavailable');
    loadRemoteModuleMock.mockRejectedValue(error);

    await expect(
      service.loadModule('bffMfaUsers', './UsersListComponent')
    ).rejects.toThrow(error);
    expect(console.error).toHaveBeenCalledWith(
      'Error cargando modulo remoto: ./UsersListComponent desde bffMfaUsers',
      error
    );
  });

  it('should load a component from the remote module', async () => {
    class UsersListComponent {}
    jest
      .spyOn(service, 'loadModule')
      .mockResolvedValue({ UsersListComponent });

    const result = await service.loadComponent(
      'bffMfaUsers',
      './UsersListComponent',
      'UsersListComponent'
    );

    expect(result).toBe(UsersListComponent);
  });

  it('should fail when the remote component does not exist in the module', async () => {
    jest.spyOn(service, 'loadModule').mockResolvedValue({});

    await expect(
      service.loadComponent(
        'bffMfaUsers',
        './UsersListComponent',
        'UsersListComponent'
      )
    ).rejects.toThrow('El componente UsersListComponent no existe');
  });

  it('should rethrow errors when the remote component cannot be loaded', async () => {
    const error = new Error('component unavailable');
    jest.spyOn(service, 'loadModule').mockRejectedValue(error);

    await expect(
      service.loadComponent(
        'bffMfaUsers',
        './UsersListComponent',
        'UsersListComponent'
      )
    ).rejects.toThrow(error);
    expect(console.error).toHaveBeenCalledWith(
      'Error cargando componente: UsersListComponent desde bffMfaUsers',
      error
    );
  });
});
