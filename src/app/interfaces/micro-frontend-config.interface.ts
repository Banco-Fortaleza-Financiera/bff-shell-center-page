export interface MicroFrontendConfig {
  name: string;
  displayName: string;
  remoteEntry: string;
  exposedModule: string;
  componentName: string;
  fallbackExposedModule?: string;
  path: string;
}
