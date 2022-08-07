import { combineReducers } from 'redux'
import reducers, { filenames } from './src/**/redux/*.js'

const result = {}

reducers.forEach((file, index) => {
    const module = file
    const Prefix = module.Prefix

    if (Prefix) {
        if (result[Prefix]) {
            console.error(`reducer警告：${filenames[index]} 和其他模块的prefix：${Prefix}重复 `)
        } else {
            result[Prefix] = module.default
        }
    } else {
        console.error(`reducer警告：${filenames[index]} 没有导出 Prefix`)
    }
})

export default combineReducers(result)
