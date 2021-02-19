const path = require('path')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  entry: {
    server: './src/server.js',
  },
  output: {
    path: path.join(__dirname, 'bin'),
    filename: '[name].js',
  },

  externals: [nodeExternals()],
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
}
