const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  babel: {
    plugins: ["@emotion"],
  },
  plugins: [
    {
      plugin: {
        overrideWebpackConfig: ({ webpackConfig }) => {
          webpackConfig.resolve.plugins.push(new TsconfigPathsPlugin({}));
          return webpackConfig;
        },
      },
    },
  ],
};
