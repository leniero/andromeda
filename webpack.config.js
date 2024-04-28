const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    // You can create a separate entry for your library files
    libs: ['three', 'three/examples/jsm/controls/OrbitControls']
  },
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: '[name].bundle.js' // This will output libs.bundle.js
  },
    
  plugins: [
    // Only enable HotModuleReplacementPlugin if you're going to use it with Flask
    new webpack.HotModuleReplacementPlugin() // Enables Hot Module Replacement
  ],
  resolve: {
    extensions: ['.js', '.json'],
    modules: [path.resolve(__dirname, 'node_modules'), 'node_modules'],
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
  watch: true // Add this line to watch for file changes
};
