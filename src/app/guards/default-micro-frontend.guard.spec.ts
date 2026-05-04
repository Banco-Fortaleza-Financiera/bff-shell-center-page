import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { defaultMicroFrontendGuard } from './default-micro-frontend.guard';

jest.mock('../config/micro-frontend-routes', () => ({
  getDefaultMicroFrontendPath: jest.fn(() => 'users'),
}));

describe('defaultMicroFrontendGuard', () => {
  const routerMock = {
    createUrlTree: jest.fn((commands) => ({ commands })),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: routerMock }],
    });
    routerMock.createUrlTree.mockClear();
  });

  it('should redirect to the default micro frontend path', () => {
    const result = TestBed.runInInjectionContext(() =>
      defaultMicroFrontendGuard({} as any, {} as any)
    );

    expect(result).toEqual({ commands: ['users'] });
  });
});
