/**
 * Configuración de entorno LOCAL
 */

export const environment = {
  production: false,
  environment: 'local',
  apiBaseUrl: 'http://localhost:8080/channel/v1',
  deviceIpProviderUrl: 'https://api.ipify.org?format=json',
  mfaConfigFile: 'assets/mfa/mfa.local.json'
};
