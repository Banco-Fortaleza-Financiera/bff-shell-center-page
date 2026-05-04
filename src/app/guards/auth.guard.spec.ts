import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('authGuard', () => {
  const authServiceMock = {
    isAuthenticated: jest.fn(),
  };
  const routerMock = {
    createUrlTree: jest.fn((commands, extras) => ({ commands, extras })),
  };
  const state = { url: '/users' } as any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    });

    authServiceMock.isAuthenticated.mockReset();
    routerMock.createUrlTree.mockClear();
  });

  it('should allow access when the user is authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, state));

    expect(result).toBe(true);
  });

  it('should redirect to login when the user is not authenticated', () => {
    authServiceMock.isAuthenticated.mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() => authGuard({} as any, state));

    expect(result).toEqual({
      commands: ['/login'],
      extras: {
        queryParams: {
          returnUrl: '/users',
        },
      },
    });
  });
});
