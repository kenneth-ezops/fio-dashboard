const webpack = require('webpack')
const path = require('path');

module.exports = {
  webpack: function(config, env) {
    if (process.env.REACT_APP_WIDGET) {
      config.entry = path.resolve(
        __dirname,
        `src/widget-${process.env.REACT_APP_WIDGET}-index.ts`,
      );
    }

    // https://github.com/facebook/create-react-app/blob/main/CHANGELOG.md
    config.resolve.fallback = {
      "assert": require.resolve('assert/'),
      "buffer": require.resolve('buffer/'),
      "stream": require.resolve("stream-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "url": require.resolve('url/'),
      ...config.resolve.fallback
    }
    config.resolve.alias = {
      process: 'process/browser',
      ...config.resolve.alias
    }
    config.plugins = [
      ...config.plugins,
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      }),
    ]

    return config;
  },
  paths: function(paths, env) {
    if (process.env.REACT_APP_WIDGET) {
      paths.appHtml = path.resolve(
        __dirname,
        `public/widget-${process.env.REACT_APP_WIDGET}-index.html`,
      );
      paths.publicUrlOrPath = `${process.env.WIDGET_PUBLIC_URL}/${process.env.REACT_APP_WIDGET}/`;
      paths.appBuild = path.resolve(
        __dirname,
        `build/${process.env.REACT_APP_WIDGET}`,
      );
    }
    return paths;
  },
};
