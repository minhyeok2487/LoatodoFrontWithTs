const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = function () {
  const plugins = [];

  if (process.env.ANALYZE === "true") {
    plugins.push(
      new BundleAnalyzerPlugin({
        analyzerMode: "static",
        openAnalyzer: false,
      })
    );
  }

  return {
    devServer: {
      client: {
        overlay: false,
      },
    },
    webpack: {
      plugins,
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
