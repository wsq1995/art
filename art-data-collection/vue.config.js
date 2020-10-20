const path = require('path')
const poststylus = require('poststylus')
const pxtorem = require('postcss-pxtorem')

const resolve = file => path.resolve(__dirname, file)
module.exports = {
    css: {
        loaderOptions: {
            stylus: {
                use: [
                    poststylus([
                        pxtorem({
                            rootValue: 100,
                            propWhiteList: [],
                            minPixelValue: 2
                        }),
                        'autoprefixer'
                    ])
                ],
                import: [
                    resolve('./src/assets/theme.custom')
                ]
            },
            postcss: {
                plugins: [
                    require('postcss-pxtorem')({
                        rootValue: 100,
                        propWhiteList: [],
                        minPixelValue: 2
                    }),
                    require('autoprefixer')()
                ]
            }
        }
    },
    publicPath: process.env.NODE_ENV === 'production'
        ? '/data-collection/'
        : '/',
    chainWebpack(config) {
        config.resolve.alias
            .set('components', resolve('src/components'))
            .set('common', resolve('src/common'))
            .set('api', resolve('src/api'))
            .set('base', resolve('src/base'))
            .set('@', resolve('src'))
    },
    transpileDependencies: [
        'mand-mobile'
    ]
}
