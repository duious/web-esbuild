/* eslint-disable react-hooks/exhaustive-deps */
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { Spin } from 'antd'
import BaseLayout from '@/src/frame/base-layout'
import { Prefix, Actions } from '@/src/frame/redux/index.js'

const RootRouter = () => {
    const {
        menu: { routerList },
    } = useSelector(state => state[Prefix])
    const dispatch = useDispatch()

    // 初始化路由列表
    useEffect(() => {
        Actions.getRouterList()(dispatch)
    }, [])

    return (
        <BrowserRouter>
            {routerList.length > 0 ? (
                <Routes>
                    <Route path="/*" element={<BaseLayout />} />
                </Routes>
            ) : (
                <div
                    style={{
                        display: 'flex',
                        flex: '1 1 auto',
                        height: '100vh',
                        width: '100vw',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <Spin spinning size="large" delay={50} />
                </div>
            )}
        </BrowserRouter>
    )
}

export default RootRouter
