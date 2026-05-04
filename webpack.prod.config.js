const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');
const config = require('./webpack.config');

module.exports = withModuleFederationPlugin({
  ...config,
  production: true,
});
