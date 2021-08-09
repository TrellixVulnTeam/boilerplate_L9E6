// standard build process
// check path, and append it to node script command
const path = require("path");

// going to organize our files
const webpack = require("webpack");

// copy files from one place to another
const CopyWebpackPlugin = require("copy-webpack-plugin");

// fetch CSS files from JS files and output CSS file
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// going to check if we are in development
const IS_DEVELOPMENT = (process.env.NODE_ENV = "dev");

// grab the location of our folders
const dirApp = path.join(__dirname, "app");
// videos and images
const dirAssets = path.join(__dirname, "assets");
// icons
const dirShared = path.join(__dirname, "shared");
// scss, css
const dirStyles = path.join(__dirname, "styles");

const dirNode = "node_modules";
module.exports = {
  entry: [
    path.join(dirApp, "index.js"),
    path.join(dirStyles, "index.scss"),
  ],
  //
  resolve: {
    modules: [
      dirApp,
      dirAssets,
      dirShared,
      dirStyles,
      dirNode,
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      IS_DEVELOPMENT,
    }),
    // assets may not be the same in the build as when you provide to client
    // shared folder will be copied to the root of the public directory
    new CopyWebpackPlugin({
      patterns: [
        {
          // we already have dirShared, so can just refer to shared
          from: "./shared",
          to: "",
        },
      ],
    }),

    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css",
    }),
  ],

  module: {
    rules: [
      {
        test: /\.handlebars$/,
        loader: "handlebars-loader",
      },
      {
        // checks if files end with .js, if it does, then it will run the babel loader for you
        test: /\.js$/,
        use: {
          // babel is a js compiler
          // e.g., allows you to import
          loader: "babel-loader",
        },
      },

      {
        // checks if files end with .scss
        test: /\.scss$/,
        //
        use: [
          {
            loader: MiniCssExtractPlugin.loader,

            // going to be outputted in public folder
            options: {
              publicPath: "",
            },
          },
          {
            //  interprets @import and url() like import/require() and will resolve them.
            loader: "css-loader",
          },
          {
            // transform styles with js plugins
            loader: "postcss-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        // tests for jpeg, jpg, png, gif, svg, woff2, fnt and webp
        test: /\.(jpe?g|png|gif|svg|woff2?|fnt|webp)$/,
        // can just import the file itself into js
        // import image from './assets/image/1.png
        loader: "file-loader",
        options: {
          // 
          name(file) {
            return "[hash].[ext]";
          },
        },
      },
      {
        test: /\.(glsl|frag|vert)$/,
        loader: "raw-loader",
        exclude: /node_modules/,
      },

      {
        test: /\.(glsl|frag|vert)$/,
        loader: "glslify-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
