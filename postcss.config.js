const autoprefixer = require('autoprefixer')
const postcssImport = require('postcss-import')
const precss = require('precss')
const postcssScss = require('postcss-scss')

module.exports = {
    parser: postcssScss,
    plugins: [
        postcssImport,
        autoprefixer({
            overrideBrowserslist: ['>=5%'],
        }),
        precss,
    ],
}
