const { resolve } = require('path')
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack")
const { join } = require("path")
require("dotenv")
  .config({
    path: join(__dirname, '.env.prod'),
  })

const staticFiles = ['manifest.json', 'icons/*', '../webui/build/webui.umd.cjs'].map(file => {
  return {
    from: file,
    to: '.'
  }
});

module.exports = {
  mode: 'production',
  entry: {
    content: resolve(__dirname, "src/content.js"),
    document: resolve(__dirname, "src/document.js"),
  },
  output: {
    path: resolve(__dirname, 'build'),
    filename: '[name].js',
  },
  plugins: [
    new CopyPlugin(
      {
        patterns: staticFiles,
      }
    ),
    new webpack.DefinePlugin({
      '__DOUYIN_PAYMENT_WS_URL__': JSON.stringify(process.env.DOUYIN_PAYMENT_WS_URL)
    })
  ],
  // devtool: process.env.NODE_ENV !== 'production'
  //   ? 'inline-source-map'
  //   : false,
}
