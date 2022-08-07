module.exports = opts => {
    const isDevelopment = opts.env() == 'development'

    return {
        presets: [
            [
                '@babel/preset-env',
                {
                    corejs: 3,
                    modules: false,
                    loose: true,
                    useBuiltIns: 'entry',
                    targets: {
                        browsers: ['last 2 versions', 'safari >= 12', 'ie>=11'],
                    },
                },
            ],
            ['@babel/preset-react'],
        ],
        plugins: [
            'babel-plugin-styled-components',
            ['@babel/plugin-proposal-decorators', { legacy: true }],
            ['@babel/plugin-proposal-class-properties', { loose: true }],
            '@babel/plugin-proposal-object-rest-spread',
            '@babel/plugin-syntax-dynamic-import',
            '@babel/plugin-proposal-optional-chaining',
            [
                '@babel/plugin-transform-runtime',
                // {
                //     corejs: false,
                //     helpers: true,
                //     regenerator: true,
                //     useESModules: true,
                // }
            ],
            [
                'import',
                {
                    libraryName: 'antd',
                    libraryDirectory: 'es',
                    style: true,
                },
                'antd',
            ],
        ],
    }
}
