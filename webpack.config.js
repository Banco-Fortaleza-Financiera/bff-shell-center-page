const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'bffShellCenterPage',
  filename: 'remoteEntry.js',
  exposes: {
    './ShellModule': './src/app/shell.module.ts',
  },
  shared: shareAll({
    singleton: true,
    strictVersion: true,
    requiredVersion: 'auto',
  }),
});
