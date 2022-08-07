import * as React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import Invoke from '../js/net/invoke'
import { RESPONSE_CODE, HOST } from '../js/config/request-config'
import API from '../custom/api'
import errorReport from '../custom/report'
import SMessage from '../js/utils/message'

const process = { env: { PACKAGE_ENV: '' } }
const appVersion = process.env.APP_VERSION

export {
    process,
    React,
    Link,
    Invoke,
    appVersion,
    RESPONSE_CODE,
    HOST,
    API,
    errorReport,
    useSelector,
    useDispatch,
    SMessage,
}
