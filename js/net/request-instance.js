// eslint-disable-next-line import/no-named-as-default
import { sCookie } from 'js-simple-utils'
import createRequestInstance from './request.js'
import { PackageEnv } from '@/js/utils/package-env.js'
import { REPORT_TYPE } from '@/custom/report.js'
import { RESPONSE_CODE } from '../config/request-config.js'

const initOptions = {
    baseURL: '',
}

if (PackageEnv.isDev) {
    initOptions.baseURL = '/dev'
}

const interceptors = {
    responseSuccess({ config, data }) {
        console.group('API response URL: ', config.url)
        console.log('code: ', data.code)
        console.log('message: ', data.message)
        console.log('data: ', data.data)
        console.groupEnd()

        if (data.code != RESPONSE_CODE.SUCCESS) {
            // 登录状态校验
            if (!sCookie.getItem('t_chatbot')) {
                SMessage.error('请先登录')
                data?.callback &&
                    setTimeout(() => {
                        window.location.pathname != (data.callback || '/') &&
                            (window.location.href = data.callback || '/')
                    }, 800)
            } else {
                SMessage.error(data.message)
            }
        }
    },
    responseFail(error) {
        const { code, name, message, config, request, response } = error

        errorReport({
            errorType: REPORT_TYPE.httpCatchError,
            url: config.url,
            params: JSON.stringify(config.data || config.params),
            errorCode: { message: '发送http请求异常', api: config.url },
            errorMsg: {
                code,
                name,
                message,
            },
            json: {
                axiosHeaders: config.headers,
                axiosHost: '',
                axiosUrl: config.url,
            },
            req: request,
            res: response,
        })
        console.error('responseFail', error)
    },
}

const requestInstance = createRequestInstance({
    initOptions,
    interceptors,
    responseFailValue(error) {
        return {
            code: 500,
            msg: '服务器出小差了',
            error,
        }
    },
})

export const { request, get, post } = requestInstance

export default requestInstance
