const merge = require('webpack-merge');
const path = require('path');
const base = require('./base');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(base, {
  mode: 'production',
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/'
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  }
});