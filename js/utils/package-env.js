const PACKAGE_ENV = process?.env?.PACKAGE_ENV

const PackageEnv = {
    isDev: PACKAGE_ENV == 'development',
    isTest: PACKAGE_ENV == 'test',
    isPre: PACKAGE_ENV == 'pre',
    isProd: PACKAGE_ENV == 'production',
}

export { PackageEnv, PACKAGE_ENV }
