/**
 * Configuración de entorno PRODUCTION
 */

export const environment = {
  production: true,
  environment: 'prod',
  apiBaseUrl: 'http://localhost:8080/channel/v1',
  deviceIpProviderUrl: 'https://api.ipify.org?format=json',
  mfaConfigFile: 'assets/mfa/mfa.prod.json',
};
