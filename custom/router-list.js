
export const RouterList = [
    {
        key: 'home',
        name: '首页',
        path: '/',
    },
    {
        key: 'data-manage',
        name: '数据管理',
        children: [
            {
                key: 'business-data',
                name: '业务数据',
                path: '/business-data',
                children: [
                    {
                        key: 'business-data-detail',
                        name: '业务数据明细',
                        path: '/business-data/detail/:id',
                        hide: true,
                    },
                ],
            },
        ],
    },
]
