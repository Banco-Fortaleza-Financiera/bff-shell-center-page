export interface MicroFrontendConfig {
  name: string;
  remoteEntry: string;
  exposedModule: string;
  componentName: string;
  fallbackExposedModule?: string;
  path: string;
}
