/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { Route, Routes, useNavigate, useLocation, matchRoutes } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Layout, Affix } from 'antd'
import { sArray, sObject } from 'js-simple-utils'
import Header from '../header/index'
import Menus from '../menus/index'
import BreadNav from '../bread-nav/index'
import { Prefix, Actions } from '../redux/index'
import { RouterConfig } from '@/js/config/router-config'
import NotFound from '@/src/not-found/index'
import style from './index.scss'

export const Redirect = ({ to, replace, state }) => {
    const navigate = useNavigate()

    useEffect(() => {
        navigate(to, { replace, state })
    }, [])

    return null
}

/**
 * 根据pathname获取菜单信息
 * @param {Object[]} routerList 路由列表
 * @param {string} key 路由key
 * @returns {Array} 菜单信息
 */
export const getActiveMenusByKey = (routerList, key) => {
    const selectItemArr = []
    const loopQuery = (list, pathKey) => {
        let i = 0

        while (i < list.length) {
            const item = list[i]

            if (item.key == pathKey) {
                selectItemArr.push(item)

                return item
            }

            if (sArray.initArray(item?.children).length > 0) {
                const itemC = loopQuery(item.children, pathKey)

                if (itemC) {
                    selectItemArr.push(item)

                    return item
                }
            }

            i++
        }
    }

    loopQuery(routerList, key)

    return selectItemArr?.map(({ icon, ...rest }) => ({ ...rest }))
}

const BaseLayout = () => {
    const {
        menu: { routerList },
        collapsed,
    } = useSelector(state => state[Prefix])
    const dispatch = useDispatch()
    const location = useLocation()
    const [routerComponentList, setRouterComponentList] = useState([])

    // 获取活动的菜单项
    const uploadActiveMenuList = () => {
        if (routerList.length === 0) {
            return
        }
        const routerFlatList = []

        const loop = list => {
            sArray.forEach(list, item => {
                if (sArray.initArray(item?.children).length > 0) {
                    loop(item?.children)
                }
                routerFlatList.push(item)
            })
        }

        loop(routerList)
        // 更新激活的菜单项
        const activeRouter = matchRoutes(routerFlatList, location.pathname)?.[0]
        const activeMenuArr = getActiveMenusByKey(routerList, activeRouter?.route.key).reverse()

        dispatch(
            Actions.modifyMenuData({
                openKeys: activeMenuArr.filter(item => item.hide != true).map(item => item.key),
                pageKeys: [activeMenuArr[activeMenuArr.length - 1]?.key],
                activeMenu: { ...activeMenuArr[activeMenuArr.length - 1] },
                activeMenuArr,
            })
        )
    }

    useEffect(() => {
        uploadActiveMenuList()
    }, [location.pathname])

    const getUserInfo = async () => {
        const { code, message, data } = await Invoke.common.getUserInfo()

        if (code != RESPONSE_CODE.SUCCESS) {
            return SMessage.error(message)
        }
        dispatch(Actions.modifyUserInfo(data))
    }

    useEffect(() => {
        getUserInfo()
    }, [])

    useEffect(() => {
        // 更新路由列表
        const RouterComponentList = []

        const loop = list => {
            sArray.forEach(list, item => {
                if (sArray.initArray(item?.children).length > 0) {
                    loop(item?.children)
                }
                sObject.isTrueValue(item?.path) && RouterComponentList.push(item)
            })
        }

        loop(routerList)
        setRouterComponentList(RouterComponentList)
        uploadActiveMenuList()
    }, [routerList])

    return (
        <Layout style={{ minHeight: '100vh' }} className={style['layout-container']}>
            <Layout.Header>
                <Header />
            </Layout.Header>
            <Layout>
                <Layout.Sider trigger={null} collapsible collapsed={collapsed}>
                    <Affix offsetTop={0}>
                        <Menus />
                    </Affix>
                </Layout.Sider>
                <Layout>
                    <BreadNav />
                    <Layout.Content className="layout-content">
                        <Routes>
                            {routerComponentList
                                .filter(item => !!RouterConfig[item.key]?.element)
                                .map(({ key, path }) => (
                                    <Route
                                        index={path === '/'}
                                        key={key}
                                        path={path}
                                        element={RouterConfig[key]?.element}
                                    />
                                ))}
                            <Route path="*" index element={<NotFound />} />
                        </Routes>
                    </Layout.Content>
                </Layout>
            </Layout>
        </Layout>
    )
}

export default BaseLayout
