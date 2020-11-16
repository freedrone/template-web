const path = require("path");
const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");

const { networkInterfaces } = require("os");

const nets = networkInterfaces();
let address = "0.0.0.0";

for (const keys of Object.keys(nets)) {
  let iface = nets[keys].filter(function (details) {
    return details.family === "IPv4" && details.internal === false;
  });

  if (iface.length > 0) address = iface[0].address;
}

module.exports = (env, argv) => {
  let plugins = [];

  if (argv.mode === "development") {
    plugins.push(new BundleAnalyzerPlugin({ analyzerMode: "static" }));
  }

  const PORT = 9000;

  return {
    plugins: plugins,
    entry: "./src/index.js",
    output: {
      filename: "main.js",
      path: path.resolve(__dirname, "dist"),
    },
    devServer: {
      host: "0.0.0.0",
      port: PORT,
      disableHostCheck: true,
      https: true,
      public: `${address}:${PORT}`,
      contentBase: path.join(__dirname, "dist"),
      compress: true,
      historyApiFallback: true,
    },
  };
};
