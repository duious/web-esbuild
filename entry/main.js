import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import { sCookie, sUrl } from 'js-simple-utils'
import EntryRouter from './entry-router'
import store from '@/redux/store'
import { PackageEnv } from '@/js/utils/package-env'
import '@antd/dist/antd.css';
import './index.scss'

dayjs.locale('zh-cn')

const container = document.getElementById('app-root')
const root = createRoot(container)

// 兼容本地调试
if (
    window.location.hostname.indexOf('.weizhipin.com') === -1 &&
    !sCookie.getItem('t_chatbot') &&
    window.location.search.indexOf('t_chatbot') !== -1
) {
    sCookie.setItem('t_chatbot', sUrl.parseSearchQuery(window.location.search)?.t_chatbot, 60 * 60 * 24 * 30, '/')
}
// if (PackageEnv.isDev) {
//     // 冻结console对象，避免修改
//     Object.freeze(console)
// }

root.render(
    <ConfigProvider locale={zhCN}>
        <Provider store={store}>
            <EntryRouter />
        </Provider>
    </ConfigProvider>
)
