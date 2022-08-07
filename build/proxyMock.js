var Mock = require('mockjs')
const API = {
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
const selectApi = [
    API.dataManage.getChatDataSelectOptions,
    API.dataManage.getDataMarkSelectOptions,
]
const listApi = [
    API.dataManage.getChatDataListData,
    API.dataManage.getChatDetailData,
]
const saveApi = [
    API.dataManage.jsonModDataMarkData,
    API.dataManage.jsonModDataReversionData,
]

const getMockRep = (url) => {
    let data = Mock.mock({
        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'list|1-10': [{
            // 属性 id 是一个自增数，起始值为 1，每次增 1
            'id|+1': 1
        }]
    })
    if (listApi.includes(url)) {
        data = Mock.mock({
            // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
            'list|1-10': [{
                // 属性 id 是一个自增数，起始值为 1，每次增 1
                'id|+1': 1,
                'dataSourceDesc|+1': 1,
                'geekId|+1': 1,
                'geekName|+1': 1,
                'lastestTimeFormat|+1': 1,
                // 'dataSourceDesc|+1': 1,
                // 'dataSourceDesc|+1': 1,
                // 'dataSourceDesc|+1': 1,
                // 'dataSourceDesc|+1': 1,
            }]
        }).list
    }
    if (selectApi.includes('select')) {
        data = Mock.mock({
            // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
            'dataSource|1-10': [{
                // 属性 id 是一个自增数，起始值为 1，每次增 1
                'label|+1': 1,
                'value|+1': 1,
            }]
        })
    }
    if (saveApi.includes('select')) {
        data = {}
    }
    return data
}

exports.getMockRep = getMockRep