import { PACKAGE_ENV } from '@/js/utils/package-env.js'

const host = ''
let domain = ''

// eslint-disable-next-line default-case
switch (PACKAGE_ENV) {
    case 'development':
        // host = '/dev'
        domain = 'test.example.com'
        break
    case 'test':
        domain = 'test.example.com'
        break
    case 'pre':
        domain = 'pre.example.com'
        break
    case 'production':
        domain = 'www.example.com'
        break
}

// 按照一级路由进行拆分模块
const API = {
    host,
    domain,
    uploadHost: '',
    common: {
        getUserInfo: '/api/user/info', // 获取用户信息
        getLogout: '/api/index/logout', // 退出登录
        getMenuList: '/api/index/menu', // 获取用户的菜单
        postImageUpload: '/api/file/uploadImg', // 文件上传
    },

    // 数据管理
    dataManage: {
        // 数据标注
        getChatDataListData: '/api/third/page', // 获取对话数据列表
        getChatDataSelectOptions: '/api/third/select', // 获取对话数据筛选项
        getChatDetailData: '/api/thirdDetail/page', // 获取数据详情列表
        getDataMarkSelectOptions: '/api/thirdDetail/tagType', // 获取数据详情筛选项
        jsonModDataMarkData: '/api/thirdDetail/tag', // 保存标注信息
        jsonModDataReversionData: '/api/thirdDetail/amend', // 保存订正信息
    },
}

export default API
