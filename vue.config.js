// vue.config.js

/**
 * @type {import('@vue/cli-service').ProjectOptions}
 */
module.exports = {
  // options...
  devServer: {
    proxy: {
      '^/api': {
        target: 'http://localhost:3005',
        changeOrigin: true,
        secure: false,
        pathRewrite: { '^/api': '/api' },
        logLevel: 'debug'
      },
    }
  },
}


