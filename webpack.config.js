const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const GoogleFontsPlugin = require('@beyonk/google-fonts-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  output: {
    path: __dirname + '/public',
    filename: "js/script.min.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
              reloadAll: true
            }
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              modules: true,
              localIdentName: "[local]___[hash:base64:5]"
            }
          },
          {
            loader: "less-loader"
          }
        ]
      },
      {
        test: /\.css$/,
        include: /node_modules\//,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'img/[hash]-[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin()
    ]
  },
  plugins: [
    new GoogleFontsPlugin({
      fonts: [{
        family: 'Roboto Serif',
        variants: ['400','700']
      },{
        family: 'Roboto Condensed',
        variants: ['400','700']
      },{
        family: 'Roboto',
        variants: ['400','700']
      }]
    }),
    new HtmlWebPackPlugin({
      template: "./src/html/index.html",
      filename: "./index.html"
    }),
    new MiniCssExtractPlugin({
      filename: 'css/styles.min.css'
    }),
    new CopyPlugin([
      { from: 'public/css/styles.min.css', to: '../drupal/2022-wcp.min.css' },
      { from: 'public/js/script.min.js', to: '../drupal/2022-wcp.min.js' },
      { from: 'public/data/data.json', to: '../drupal/2022-wcp.json' },
      { from: 'media/img/', to: 'img' },
      { from: 'media/data/', to: 'data' },
      { from: 'favicon.png', to: '' }
    ])
  ]
};