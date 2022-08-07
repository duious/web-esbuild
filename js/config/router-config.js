import React, { Suspense, lazy, memo } from 'react'
import { Skeleton, Space } from 'antd'

const RouterLoadingSkeleton = memo(() => (
    <div>
        <div key="row1">
            <Space>
                <Skeleton.Input active />
                <Skeleton.Input active />
                <Skeleton.Input active />
                <Skeleton.Button active />
                <Skeleton.Button active />
            </Space>
        </div>
        <div key="row2" style={{ marginTop: '48px' }}>
            <Skeleton active title={false} paragraph={{ rows: 4 }} />
            <Skeleton style={{ marginTop: '48px' }} active title={false} paragraph={{ rows: 4 }} />
            <Skeleton style={{ marginTop: '48px' }} active title={false} paragraph={{ rows: 4 }} />
            <Skeleton style={{ marginTop: '48px' }} active title={false} paragraph={{ rows: 4 }} />
        </div>
    </div>
))
const Home = lazy(() => import('@/src/home/index'))
const BusinessData = lazy(() => import('@/src/business-data/pages/list/index'))
const BusinessDataDetail = lazy(() => import('@/src/business-data/pages/detail/index'))

/**
 * 配置全部路由组件
 */
const RouterConfig = {
    home: {
        element: (
            <Suspense fallback={<RouterLoadingSkeleton />}>
                <Home />
            </Suspense>
        ),
    },
    'business-data': {
        element: (
            <Suspense fallback={<RouterLoadingSkeleton />}>
                <BusinessData />
            </Suspense>
        ),
    },
    'business-data-detail': {
        hide: true,
        element: (
            <Suspense fallback={<RouterLoadingSkeleton />}>
                <BusinessDataDetail />
            </Suspense>
        ),
    },
}

export { RouterConfig }
