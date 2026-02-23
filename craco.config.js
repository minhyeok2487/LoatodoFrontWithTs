const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = function () {
  return {
    devServer: {
      client: {
        overlay: false,
      },
    },
    webpack: {
      plugins: [
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          openAnalyzer: false,
        }),
      ],
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
};
