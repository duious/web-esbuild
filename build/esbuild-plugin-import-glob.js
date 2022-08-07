const fastGlob = require('fast-glob')

/**
 * 处理 import 指令 glob 导入
 * @returns
 */
const EsbuildPluginImportGlob = ({ resolveDir }) => ({
    name: 'require-context',
    setup: build => {
        build.onResolve({ filter: /\*/ }, async args => {
            if (args.resolveDir === '') {
                return // Ignore unresolvable paths
            }

            return {
                path: args.path,
                namespace: 'import-glob',
                pluginData: {
                    resolveDir: resolveDir || args.resolveDir,
                },
            }
        })

        build.onLoad({ filter: /.*/, namespace: 'import-glob' }, async args => {
            const files = (
                await fastGlob(args.path, {
                    cwd: args.pluginData.resolveDir,
                })
            ).sort()

            const importerCode = `
            ${files.map((module, index) => `import * as module${index} from '${module}'`).join(';')}
            const modules = [${files.map((_module, index) => `module${index}`).join(',')}];
            export default modules;
            export const filenames = [${files.map(module => `'${module}'`).join(',')}]`

            return { contents: importerCode, resolveDir: args.pluginData.resolveDir }
        })
    },
})

exports.default = EsbuildPluginImportGlob
