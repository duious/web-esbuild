const REPORT_TYPE = {
    jsError: 'jsError', // JS报错
    codeError: 'codeError', // 数据异常
    performance: 'performance', // 接口性能
    httpCatchError: 'httpCatchError', // 请求异常
    resource404: 'resource404', // 资源404
    404: '404', // 路由404
    appAbnormal: 'appAbnormal', // 客户端异常
    serverError: 'serverError', // 服务器异常
    promiseCatch: 'promiseCatch', // promise异常
    messageFail: 'message-fail', // 消息发送失败
    collectData: 'collectData', // 自定义收集数据
}

const errorReport = data => {

}

export { REPORT_TYPE }
export default errorReport
