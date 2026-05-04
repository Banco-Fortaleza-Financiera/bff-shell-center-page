import { CanMatchFn, Router, UrlSegment } from '@angular/router';
import { inject } from '@angular/core';

import {
  getDefaultMicroFrontendPath,
  getMicroFrontendByPath,
} from '../config/micro-frontend-routes';

export const microFrontendMatchGuard: CanMatchFn = (_route, segments: UrlSegment[]) => {
  const router = inject(Router);
  const path = segments[0]?.path;

  if (path && getMicroFrontendByPath(path)) {
    return true;
  }

  return router.createUrlTree([getDefaultMicroFrontendPath()]);
};
