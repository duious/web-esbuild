import { configureStore } from '@reduxjs/toolkit'
import { logger } from 'redux-logger'
import { PackageEnv } from '@/js/utils/package-env.js'
import reducer from './reducer.js'

const store = configureStore({
    devTools: !PackageEnv.isProd,
    reducer,
    middleware: getDefaultMiddleware => getDefaultMiddleware().concat(logger),
})

export default store
