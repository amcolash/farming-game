const path = require('path');

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
  devServer: {
    contentBase: path.join(__dirname, '../'),
    compress: true,
    port: 9000,
    open: true,
    host: '127.0.0.1'
  }
};