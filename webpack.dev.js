const path = require("path")
const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    static: {
      directory: path.resolve(__dirname, "dist"),
    },
    port: 9000,
    open: true,
    hot: false, // 🔥 DISABLE HMR - fix infinite refresh
    liveReload: true, // Keep live reload for file changes
    compress: true,
    historyApiFallback: true,
    watchFiles: ["src/**/*"], // Watch for file changes
    client: {
      logging: "info",
      overlay: {
        errors: true,
        warnings: false,
      },
      progress: true,
    },
  },
})
