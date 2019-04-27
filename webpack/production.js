const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./base');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge.strategy({
  'plugins': 'replace'
})(base, {
  mode: 'production',
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
  },
  plugins: [
    new webpack.DefinePlugin({
      __DEV__: false
    })
  ]
});