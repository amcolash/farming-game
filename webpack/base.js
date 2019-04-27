const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.tsx', '.js' ],
  },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/'
  },
  devServer: {
    contentBase: path.join(__dirname, '../'),
    compress: true,
    port: 9000,
    open: true,
    host: '127.0.0.1'
  },
  plugins: [
    new webpack.DefinePlugin({
      DEV: true
    })
  ]
};