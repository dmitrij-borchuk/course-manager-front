const webpack = require('webpack')
const commitHashBuffer = require('child_process').execSync('git rev-parse HEAD')
const commitHash = commitHashBuffer.toString()

module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  webpack: {
    plugins: {
      add: [
        new webpack.DefinePlugin({
          'process.env.REACT_APP_VERSION': JSON.stringify(commitHash),
        }),
      ],
    },
  },
}
