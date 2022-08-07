/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
const { build } = require('esbuild')
const path = require('path')
const fs = require('fs')
const autoprefixer = require('autoprefixer')
const AliasPlugin = require('esbuild-plugin-path-alias')
const ImportPlugin = require('./esbuild-plugin-import').default
const ImportGlobPlugin = require('./esbuild-plugin-import-glob').default
const JsxStylePlugin = require('./esbuild-plugin-jsx-style').default
const PostCssPlugin = require('./esbuild-plugin-postcss')
const PackageUtils = require('./package.utils.js')
const AntdThemes = require('./themes.js')

const isDevelopment = process.env.PACKAGE_ENV == 'development'

build({
    entryPoints: [path.resolve(PackageUtils.Config.entryPath, './index.js')],
    outdir: PackageUtils.getBuildPath(process.env.PACKAGE_ENV),
    bundle: true,
    platform: 'browser',
    metafile: true,
    sourcemap: false,
    minify: true,
    splitting: true,
    chunkNames: '[ext]/[name]-[hash]',
    assetNames: 'assets/[name]-[hash]',
    charset: 'utf8',
    drop: ['debugger', 'console'],
    treeShaking: true,
    format: 'esm',
    target: ['es2016'],
    inject: [path.resolve(PackageUtils.Config.scriptPath, './inject.js')],
    loader: {
        '.html': 'text',
        '.js': 'jsx',
        '.jsx': 'jsx',
        '.scss': 'css',
        '.sass': 'css',
        '.less': 'css',
        '.css': 'css',
        '.png': 'dataurl',
        '.jpg': 'dataurl',
        '.jpeg': 'dataurl',
    },
    plugins: [
        AliasPlugin({
            '@': path.resolve(__dirname, '../'),
        }),
        ImportPlugin(),
        ImportGlobPlugin({
            resolveDir: path.resolve(__dirname, '../'),
        }),
        JsxStylePlugin(),
        // SassPlugin({
        //     rootDir: path.resolve(PackageUtils.Config.rootPath),
        //     customSassOptions: {
        //         loadPaths: [path.resolve(PackageUtils.Config.entryPath, './style')],
        //         style: 'compressed',
        //     },
        // }),

        PostCssPlugin.default({
            rootDir: path.resolve(PackageUtils.Config.rootPath),
            plugins: [
                require('postcss-modules-local-by-default')({ mode: 'local' }),
                require('postcss-modules-extract-imports'),
                require('postcss-modules-scope')({
                    generateScopedName: (name, path) => PackageUtils.getScopedName(name, path),
                }),
                autoprefixer({
                    overrideBrowserslist: ['>=5%'],
                }),
            ],
            writeToFile: true,
            sassOptions: {
                loadPaths: [path.resolve(PackageUtils.Config.entryPath, './style')],
            },
            lessOptions: {
                javascriptEnabled: true,
                rootpath: path.resolve(PackageUtils.Config.rootPath, './node_modules'),
            },
        }),
        {
            name: 'copy-static-files',
            setup(build) {
                try {
                    fs.rmSync(path.resolve(PackageUtils.getBuildPath(process.env.PACKAGE_ENV)), {
                        recursive: true,
                    })
                } catch (e) {}

                build.onStart(() => {
                    fs.mkdirSync(path.resolve(PackageUtils.getBuildPath(process.env.PACKAGE_ENV)), {
                        recursive: true,
                    })

                    fs.writeFileSync(
                        path.resolve(PackageUtils.getBuildPath(process.env.PACKAGE_ENV), './index.html'),
                        fs.readFileSync(path.resolve(PackageUtils.Config.entryPath, './index.html'), 'utf-8'),
                        'utf8'
                    )

                    fs.writeFileSync(
                        path.resolve(PackageUtils.getBuildPath(process.env.PACKAGE_ENV), './favicon.ico'),
                        fs.readFileSync(path.resolve(PackageUtils.Config.entryPath, './favicon.ico'), 'utf-8'),
                        'utf8'
                    )
                })
            },
        },
    ],
}).catch(res => {
    console.log(res)
    process.exit(1)
})
