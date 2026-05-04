import { TestBed } from '@angular/core/testing';
import { Router, UrlSegment } from '@angular/router';

import { microFrontendMatchGuard } from './micro-frontend-match.guard';
import {
  getDefaultMicroFrontendPath,
  getMicroFrontendByPath,
} from '../config/micro-frontend-routes';

jest.mock('../config/micro-frontend-routes', () => ({
  getDefaultMicroFrontendPath: jest.fn(() => 'users'),
  getMicroFrontendByPath: jest.fn(),
}));

describe('microFrontendMatchGuard', () => {
  const routerMock = {
    createUrlTree: jest.fn((commands) => ({ commands })),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: routerMock }],
    });

    jest.mocked(getMicroFrontendByPath).mockReset();
    jest.mocked(getDefaultMicroFrontendPath).mockReturnValue('users');
    routerMock.createUrlTree.mockClear();
  });

  it('should allow the route when the path exists', () => {
    jest.mocked(getMicroFrontendByPath).mockReturnValue({ path: 'users' } as any);

    const result = TestBed.runInInjectionContext(() =>
      microFrontendMatchGuard({} as any, [new UrlSegment('users', {})])
    );

    expect(result).toBe(true);
  });

  it('should redirect to the default path when the path does not exist', () => {
    jest.mocked(getMicroFrontendByPath).mockReturnValue(undefined);

    const result = TestBed.runInInjectionContext(() =>
      microFrontendMatchGuard({} as any, [new UrlSegment('unknown', {})])
    );

    expect(result).toEqual({ commands: ['users'] });
  });
});
