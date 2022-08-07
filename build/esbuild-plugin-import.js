const fs = require('fs')
const path = require('path')

const checkFilePath = filePath => {
    let res = filePath

    if (res.indexOf('@') === 0) {
        let fp = res.substring(1)
        if (fs.existsSync(`${process.cwd()}/src/${res}`)) {
            res = `${process.cwd()}/src/${res}`
        }
        if (fs.existsSync(`${process.cwd()}/node_modules/${res}`)) {
            res = `${process.cwd()}/node_modules/${res}`
        }
        if (fp.indexOf('/') === 0) {
            fp = fp.substring(1)
        }
        if (fs.existsSync(`${process.cwd()}/src/${fp}`)) {
            res = `${process.cwd()}/src/${fp}`
        }
        if (fs.existsSync(`${process.cwd()}/node_modules/${fp}`)) {
            res = `${process.cwd()}/node_modules/${fp}`
        }
    }
    //  console.log('checkFilePath', res)
    return res
}

const importPlugin = () => ({
    name: 'esbuild-plugin-importer',
    setup(build) {
        build.onResolve({ filter: /.\.(css|sass|scss|less|styl)$/ }, async args => {
            if (args.namespace !== 'file' && args.namespace !== '') return
            if (args.importer.indexOf('/node_modules/') !== -1) return
            if (args.path.indexOf('@') < 0) return
            const { importer, resolveDir, kind, ...rest } = args
            let filepath = await checkFilePath(`${args.path || ''}`)
            if (filepath && filepath.indexOf('/') !== 0) {
                filepath = path.resolve(resolveDir, filepath)
            }
            return {
                ...rest,
                path: filepath,
            }
        })
    },
})

exports.default = importPlugin
