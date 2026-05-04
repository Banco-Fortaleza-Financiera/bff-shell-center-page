/**
 * Configuración de entorno DEVELOPMENT
 */

export const environment = {
  production: false,
  environment: 'dev',
  apiBaseUrl: 'http://localhost:8080/channel/v1',
  deviceIpProviderUrl: 'https://api.ipify.org?format=json',
  mfaConfigFile: 'assets/mfa/mfa.dev.json'
};
