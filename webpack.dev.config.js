var UglifyJsPlugin = require("uglifyjs-webpack-plugin");
var path = require("path");

module.exports = {
  mode: "development",
  context: `${__dirname}/src/`,
  entry: {
    polyfills: "./js/polyfills.js",
    utils: "./js/utils.js",
    SDK: "./js/sdk/SDK.js",
    "SDK.min": "./js/sdk/SDK.js",
    "level-editor": "./js/levelEditor.js",
    "level-editor.min": "./js/levelEditor.js",
    game: "./js/index.js",
    "game.min": "./js/index.js"
  },
  output: {
    path: path.resolve(__dirname, "dist", "js"),
    filename: "[name].js"
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        include: /\.min\.js$/,
        parallel: true,
        // generate source maps for minified code
        sourceMap: true,
        uglifyOptions: {
          compress: true,
          ie8: false,
          output: { comments: false },
          warnings: false
        }
      })
    ]
  },
  devtool: "source-map"
};
