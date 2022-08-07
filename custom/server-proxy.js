const HOST = {
    // development: 'https://mock.example.com/2190',
    development: 'https://test.example.com/',
    test: 'https://test.example.com/',
    pre: 'https://pre.example.com/',
    production: 'https://www.example.com/',
}

module.exports = {
    '/dev/api': {
        target: HOST[process.env.PACKAGE_ENV],
        pathRewrite: {
            '^/dev': '',
        },
        secure: false,
        changeOrigin: true,
    },
}
