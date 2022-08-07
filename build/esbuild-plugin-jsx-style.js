const fs = require('fs')

const jsxStylePlugin = () => ({
    name: 'esbuild-plugin-jsx-style',
    setup(build) {
        build.onLoad({ filter: /\.(js|jsx)$/ }, async args => {
            if (
                args.path.indexOf('/node_modules/') !== -1
            )
                return
            const { importer, resolveDir, kind, path, namespace, suffix, ...rest } = args
            const regexp = () => {
                return new RegExp(/className=\{[^=>]*\}([(\s+\w+=)|>])/, 'g')
            }
            let text = await fs.promises.readFile(args.path, 'utf8')
            const result = text.match(regexp())
            if (result && result.length > 0) {
                let sanitisedPath = path.replace(`${process.cwd()}/`, '').replace('src/', '').replace('components/', '')

                sanitisedPath = sanitisedPath
                    .replace(/\.[^./\\]+$/, '')
                    .replace(/[\W_]+/g, '_')
                    .replace(/^_|_$/g, '')
                for (const item of result) {
                    if (item.indexOf('[') !== -1) {
                        let key = item.split("['")[1]
                            key = key.substring(0, key.indexOf('\''))
                        text = text
                            .replace('${' +`style['${key}']` + '}', `${sanitisedPath}__${key}`)
                            .replace(`{style['${key}']}`, `'${sanitisedPath}__${key}'`)
                    }
                }
            }

            return {
                ...rest,
                contents: text,
                loader: 'jsx',
            }
        })
    },
})

exports.default = jsxStylePlugin
