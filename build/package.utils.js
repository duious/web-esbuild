const path = require('path')

const rootPath = path.resolve(__dirname, '../')

/**
 * 获取正则表达式
 *
 * @param { array } arr ["antd", "@ant-design"]
 * @returns array [\\/@]antd[\\/]|[\\/@]@ant-design[\\/]
 */
const getPathRegexp = arr => {
    const str = arr
        .map(item => {
            return `[\\\\/@]${item}[\\\\/]`
        })
        .join('|')

    return new RegExp(str)
}

// 获取打包路径
const getBuildPath = function (env) {
    switch (env) {
        case 'test':
            return path.resolve(rootPath, './dist/test')
        case 'pre':
            return path.resolve(rootPath, './dist/pre')
        case 'production':
            return path.resolve(rootPath, './dist/pro')
        default:
            return path.resolve(rootPath, './dist/dev')
    }
}

const Config = {
    prefix: '',
    port: '3010',
    rootPath: path.resolve(__dirname, '../'),
    entryPath: path.resolve(rootPath, './entry'),
    scriptPath: path.resolve(rootPath, './build'),
    buildPath: path.resolve(rootPath, './dist'),
}

const getScopedName = (name, path) => {
    let sanitisedPath = path.replace(`${process.cwd()}/`, '').replace('src/', '').replace('components/', '')

    sanitisedPath = sanitisedPath
        .replace(/\.[^./\\]+$/, '')
        .replace(/[\W_]+/g, '_')
        .replace(/^_|_$/g, '')

    return `${sanitisedPath}__${name}`.trim()
}

module.exports = { Config, getPathRegexp, getBuildPath, getScopedName }
