// copy all the things that you have from build and merge with another object
const { merge } = require("webpack-merge");

const path = require("path");

const config = require("./webpack.config");

module.exports = merge(config, {
  // setting up the mode of the webpack, currently in development mode
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    writeToDisk: true,
  },
  output: {
    path: path.resolve(__dirname, "public"),
  },
});
