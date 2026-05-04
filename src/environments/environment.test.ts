/**
 * Configuración de entorno TEST
 */

export const environment = {
  production: false,
  environment: 'test',
  apiBaseUrl: 'http://localhost:8080/channel/v1',
  deviceIpProviderUrl: 'https://api.ipify.org?format=json',
  mfaConfigFile: 'assets/mfa/mfa.test.json',
};
