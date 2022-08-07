/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
const { serve } = require('esbuild')
const http = require('http')
const httpProxy = require('http-proxy')
const path = require('path')
const fs = require('fs')
const autoprefixer = require('autoprefixer')
const PathAliasPlugin = require('esbuild-plugin-path-alias')
const CssImportPlugin = require('./esbuild-plugin-import').default
const ImportGlobPlugin = require('./esbuild-plugin-import-glob').default
const JsxStylePlugin = require('./esbuild-plugin-jsx-style').default
const PostCssPlugin = require('./esbuild-plugin-postcss')
const PackageUtils = require('./package.utils')
var { getMockRep } = require('./proxyMock')

const isDevelopment = process.env.PACKAGE_ENV == 'development'
const HOST = {
    // development: 'https://mock.example.com/2190',
    development: 'https://test.example.com/',
    test: 'https://test.example.com/',
    pre: 'https://pre.example.com/',
    production: 'https://www.example.com/',
}
const defPort = 3020

serve(
    {
        port: defPort + 1024,
        servedir: PackageUtils.getBuildPath(process.env.PACKAGE_ENV),
    },
    {
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
        drop: !isDevelopment ? [('debugger', 'console')] : [],
        treeShaking: true,
        format: 'esm',
        target: ['es2016'],
        inject: [path.resolve(PackageUtils.Config.scriptPath, './inject.js')],
        define: {},
        // jsxDev: true,
        // jsx: 'automatic',
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
            PathAliasPlugin({
                '@': path.resolve(__dirname, '../'),
            }),
            CssImportPlugin(),
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
    }
)
    .then(result => {
        const { port, host } = result
        const proxy = httpProxy.createProxyServer({
            changeOrigin: true,
            ignorePath: false,
        })

        http.createServer((req, res) => {
            if (req.url.indexOf('/api/') !== -1) {
                // proxy.web(req, res, {
                //     target: HOST[process.env.PACKAGE_ENV],
                //     secure: false,
                //     changeOrigin: true,
                // })
                res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
                res.write(JSON.stringify({ code: 0, data: getMockRep(req.url.split('?')[0]), message: 'success', totalRecords: 100, totalPages: 10, size: 20, current: 1, hasNext: false }));
                res.end()
            } else {
                proxy.web(req, res, {
                    target: `http://${host}:${port}/`,
                })
            }
        }).listen(defPort, function () {
            console.info(`server is running at http://127.0.0.1:${defPort}`)
        })
    })
    .catch(res => {
        console.log(res)
        process.exit(1)
    })
