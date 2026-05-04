import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { getDefaultMicroFrontendPath } from '../config/micro-frontend-routes';

export const defaultMicroFrontendGuard: CanActivateFn = () => {
  const router = inject(Router);

  return router.createUrlTree([getDefaultMicroFrontendPath()]);
};
