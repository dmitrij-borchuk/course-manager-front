const webpack = require('webpack')
const commitHashBuffer = require('child_process').execSync('git rev-parse HEAD')
const commitHash = commitHashBuffer.toString()

module.exports = {
  webpack: {
    plugins: {
      add: [
        new webpack.DefinePlugin({
          'process.env.REACT_APP_VERSION': JSON.stringify(commitHash),
        }),

        // For the React-pdf library
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
      ],
    },
    configure: {
      resolve: {
        fallback: {
          buffer: require.resolve('buffer'),
          util: require.resolve('util'),
          stream: require.resolve('stream-browserify'),
          zlib: require.resolve('browserify-zlib'),
          assert: require.resolve('assert'),
          'process/browser': require.resolve('process/browser'),
        },
      },
    },
  },
}
