const CopyWebpackPlugin = require('copy-webpack-plugin')
const { resolve } = require('path')

module.exports = {
  outputDir: resolve(__dirname, './release'),
  publicPath: process.env.NODE_ENV === 'production' ? `././` : '/',
  filenameHashing: false,
  configureWebpack: process.env.NODE_ENV === 'production'
    ? {
      plugins: [
        new CopyWebpackPlugin([{
          from: './icon.icns', to: './'
        }, {
          from: './package.json', to: './'
        }, {
          from: './electron/*.js', to: '[name].[ext]'
        }])
      ]
    }
    : {},
  chainWebpack: config => {
    const svgRule = config.module.rule('svg')

    svgRule.exclude
      .add(resolve(__dirname, './src/icons'))
      .end()

    config.module
      .rule('svg-sprite')
        .test(/\.svg$/)
        .include
          .add(resolve(__dirname, './src/icons'))
          .end()
        .use('svg')
          .loader('svg-sprite-loader')
          .options({
            symbolId: 'icon-[name]'
          })
  }
}
