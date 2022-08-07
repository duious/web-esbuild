const { ensureDir, readFile, readdirSync, statSync, writeFile } =require('fs-extra')
const { TextDecoder } =require( 'util')
const path =require( 'path')
const fs = require('fs')
const tmp =require( 'tmp')
const postcss =require( 'postcss')
const postcssModules =require( 'postcss-modules')
const less =require( 'less')
const stylus =require( 'stylus')
const resolveFile = require('resolve-file')
const defaultOptions = {
    plugins: [],
    modules: true,
    rootDir: process.cwd(),
    sassOptions: {},
    lessOptions: {},
    stylusOptions: {},
    writeToFile: true,
    fileIsModule: null,
}

const postCSSPlugin = ({
    plugins,
    modules,
    rootDir,
    sassOptions,
    lessOptions,
    stylusOptions,
    writeToFile,
    fileIsModule,
} = defaultOptions) => ({
    name: 'esbuild-plugin-postcss',
    setup(build) {
        const tmpDirPath = tmp.dirSync().name,
            modulesMap = []
        const modulesPlugin = postcssModules({
            generateScopedName: '[name]__[local]___[hash:base64:5]',
            ...(typeof modules !== 'boolean' ? modules : {}),
            getJSON(filepath, json, outpath) {
                const mapIndex = modulesMap.findIndex(m => m.path === filepath)
                if (mapIndex !== -1) {
                    modulesMap[mapIndex].map = json
                } else {
                    modulesMap.push({
                        path: filepath,
                        map: json,
                    })
                }
                if (typeof modules !== 'boolean' && typeof modules.getJSON === 'function')
                    return modules.getJSON(filepath, json, outpath)
            },
        })
        build.onResolve({ filter: /.\.(css|sass|scss|less|styl)$/ }, async args => {
            if (args.namespace !== 'file' && args.namespace !== '') return
            // console.log('00000000000-', args)
            let filepath = `${args.path || ''}`
            let sourceFullPath = resolveFile(filepath)
            if (!sourceFullPath) sourceFullPath = path.resolve(args.resolveDir, filepath)
            const sourceExt = path.extname(sourceFullPath)
            const sourceBaseName = path.basename(sourceFullPath, sourceExt)
            const isModule = fileIsModule ? fileIsModule(sourceFullPath) : sourceBaseName.match(/\.module$/)
            const sourceDir = path.dirname(sourceFullPath)
            let tmpFilePath
            if (args.kind === 'entry-point') {
                const sourceRelDir = path.relative(path.dirname(rootDir), path.dirname(sourceFullPath))
                tmpFilePath = path.resolve(tmpDirPath, sourceRelDir, `${sourceBaseName}.css`)
                await ensureDir(path.dirname(tmpFilePath))
            } else {
                const uniqueTmpDir = path.resolve(tmpDirPath, uniqueId())
                tmpFilePath = path.resolve(uniqueTmpDir, `${sourceBaseName}.css`)
            }
            await ensureDir(path.dirname(tmpFilePath))
            const fileContent = await readFile(sourceFullPath)
            let css = sourceExt === '.css' ? fileContent : ''
            if (sourceExt === '.sass' || sourceExt === '.scss') {
                css = (await require('sass').compile(sourceFullPath, sassOptions)).css.toString()
            }
            if (sourceExt === '.styl')
                css = await renderStylus(new TextDecoder().decode(fileContent), {
                    ...stylusOptions,
                    filename: sourceFullPath,
                })
            if (sourceExt === '.less')
                css = (
                    await less.render(new TextDecoder().decode(fileContent), {
                        ...lessOptions,
                        filename: sourceFullPath,
                        rootpath: path.dirname(filepath),
                    })
                ).css
            // console.log('-------', css)
            const result = await postcss(isModule ? [ modulesPlugin, ...plugins] : plugins).process(css, {
                from: sourceFullPath,
                to: tmpFilePath,
            })
            if (writeToFile) {
                await writeFile(tmpFilePath, result.css)
            }
            return {
                namespace: isModule ? 'postcss-module' : writeToFile ? 'file' : 'postcss-text',
                path: tmpFilePath,
                watchFiles: [result.opts.from].concat(getPostCssDependencies(result.messages)),
                pluginData: {
                    originalPath: sourceFullPath,
                    css: result.css,
                },
            }
        })
        build.onLoad({ filter: /.*/, namespace: 'postcss-module' }, async args => {
            let filepath = args.path // checkFilePath(`${args.path || ''}`)
            const mod = modulesMap.find(({ path: path2 }) => path2 === args.pluginData.originalPath),
                resolveDir = path.dirname(filepath),
                css = args.pluginData.css || ''
            return {
                resolveDir,
                contents: [
                    writeToFile ? `import ${JSON.stringify(filepath)};` : null,
                    `export default ${JSON.stringify(mod && mod.map ? mod.map : {})};`,
                    writeToFile ? null : `export const stylesheet=${JSON.stringify(css)};`,
                ]
                    .filter(Boolean)
                    .join('\n'),
            }
        })
        build.onLoad({ filter: /.*/, namespace: 'postcss-text' }, async args => {
            const css = args.pluginData.css || ''
            return {
                contents: `export default ${JSON.stringify(css)};`,
            }
        })
    },
})
function renderSass(options) {
    return new Promise((resolve, reject) => {
        getSassImpl().render(options, (e, res) => {
            console.log('renderSass-------', options)
            if (e) reject(e)
            else resolve(res)
        })
    })
}
function renderStylus(str, options) {
    return new Promise((resolve, reject) => {
        stylus.render(str, options, (e, res) => {
            if (e) reject(e)
            else resolve(res)
        })
    })
}
function getSassImpl() {
    let impl = 'sass'
    try {
        require.resolve('sass')
    } catch {
        try {
            require.resolve('node-sass')
            impl = 'node-sass'
        } catch {
            throw new Error('Please install "sass" or "node-sass" package')
        }
    }
    return require(impl)
}
function getFilesRecursive(directory) {
    return readdirSync(directory).reduce((files, file) => {
        const name = path.join(directory, file)
        return statSync(name).isDirectory() ? [...files, ...getFilesRecursive(name)] : [...files, name]
    }, [])
}
let idCounter = 0
function uniqueId() {
    return Date.now().toString(16) + (idCounter++).toString(16)
}
function getPostCssDependencies(messages) {
    let dependencies = []
    for (const message of messages) {
        if (message.type == 'dir-dependency') {
            dependencies.push(...getFilesRecursive(message.dir))
        } else if (message.type == 'dependency') {
            dependencies.push(message.file)
        }
    }
    return dependencies
}
exports.default = postCSSPlugin
