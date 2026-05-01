import { MicroFrontendConfig } from '../interfaces/micro-frontend-config.interface';

export const MICRO_FRONTENDS: MicroFrontendConfig[] = [
  {
    name: 'bffMfaUsers',
    remoteEntry: 'http://localhost:4201/remoteEntry.js',
    exposedModule: './UsersListComponent',
    componentName: 'UsersListComponent',
    fallbackExposedModule: './UsersModule',
    path: 'users',
  },
];
