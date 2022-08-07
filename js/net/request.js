import Qs from 'query-string'
import axios from 'axios'
import { RESPONSE_CODE } from '../config/request-config'
import { REPORT_TYPE } from '@/custom/report'

const createRequestInstance = ({ initOptions, interceptors = {}, requestFailValue, responseFailValue }) => {
    const axiosInstance = axios.create({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            'x-requested-with': 'XMLHttpRequest',
        },
        ...initOptions,
        timeout: 30 * 1000,
        withCredentials: true,
    })

    // 添加一个请求拦截器
    axiosInstance.interceptors.request.use(
        function (config) {
            runInterceptor(interceptors.requestSuccess, config)

            return config
        },
        function (error) {
            runInterceptor(interceptors.requestFail, error)

            if (requestFailValue) {
                return requestFailValue(error)
            }

            return Promise.reject(error)
        }
    )

    // 添加一个响应拦截器
    axiosInstance.interceptors.response.use(
        function (response) {
            runInterceptor(interceptors.responseSuccess, response)
            // 喜鹊上报请求失败情况
            handleResponseSuccess(response)
            const { code, message, data } = response.data

            if (code == RESPONSE_CODE.SERVICE_ERROR) {
                return SMessage.error(message || '服务器出小差了')
            }

            return response.data
        },
        function (error) {
            runInterceptor(interceptors.responseFail, error)
            if (responseFailValue) {
                return responseFailValue(error)
            }

            return Promise.reject(error)
        }
    )

    const runInterceptor = function (interceptor, options) {
        if (!interceptor || typeof interceptor !== 'function') {
            return
        }

        try {
            interceptor(options)
        } catch (error) {
            console.error('runInterceptor：', error)
        }
    }

    const request = function (options) {
        const config = {
            url: '',
            method: 'get',
            data: {},
            responseType: 'json',
            requestType: 'form',
            headers: {},
            ...options,
        }

        if (config.method.toLowerCase() == 'post') {
            if (config.requestType.toLowerCase() == 'json') {
                config.headers['Content-Type'] = 'application/json;charset=utf-8'
            } else {
                config.data = Qs.stringify(config.data, { arrayFormat: 'repeat' })
            }
        } else {
            config.params = config.data
        }

        return axiosInstance.request(config)
    }

    const get = function (url, data, options) {
        return request({ data, url, ...options, method: 'get' })
    }

    const post = function (url, data, options) {
        return request({ data, url, ...options, method: 'post' })
    }

    return {
        request,
        get,
        post,
    }
}

// 服务端上报过滤code
const serverFilterCode = function ({ code = '' }) {
    return [].includes(code)
}

// 数据异常拦截（成功时判断）
const handleResponseSuccess = function (response) {
    const data = response.data || {}
    const config = response.config

    if (!serverFilterCode(data)) {
        const type = REPORT_TYPE.codeError
        const message = '服务端接口数据异常'

        // 服务端请求接口403（一般都是某一ip频繁访问）
        if (data.code != RESPONSE_CODE.SUCCESS) {
            errorReport({
                errorType: type,
                url: config.url,
                params: JSON.stringify(config.reqData || config.params),
                errorCode: { code: data.code, message, api: response.request.path },
                errorMsg: {
                    message,
                    data,
                },
                json: {
                    axiosHeaders: config.headers,
                    axiosHost: '',
                    axiosUrl: response.request.path,
                },
                req: response.config.req,
                res: response.config.res,
            })
        }
    }

    // 接口超时处理
    if (response.duration >= 5000) {
        errorReport({
            errorType: 'performance',
            url: config.url,
            params: JSON.stringify(config.reqData || config.params),
            errorCode: { message: '服务端接口超时5000ms', api: response.request.path },
            errorMsg: {},
            json: {
                axiosHeaders: config.headers,
                axiosHost: '',
                axiosUrl: response.request.path,
            },
            req: response.config.req,
            res: response.config.res,
        })
    }
}

export default createRequestInstance
