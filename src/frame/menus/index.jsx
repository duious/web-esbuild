/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Menu } from 'antd'
import { sArray } from 'js-simple-utils'
import { Prefix, Actions } from '../redux/index.js'
import menuIcon from './icon.js'
import style from './index.scss'
import { getActiveMenusByKey } from '../base-layout/index'

/**
 * 菜单组件过滤
 * @param {*} menuList 菜单列表
 * @returns {Array} 过滤后的菜单列表
 */
const filterMenuList = menuList => {
    if (sArray.initArray(menuList) === 0) {
        return []
    }
    const arr = []

    sArray.forEach(menuList, ({ hide, key, children = [], name, icon, ...rest }) => {
        if (!(hide === true)) {
            const childrenArr = filterMenuList(children.filter(childItem => childItem.hide !== true))

            arr.push(
                childrenArr.length > 0
                    ? {
                          ...rest,
                          hide,
                          key,
                          label: name,
                          icon: menuIcon[key] || null,
                          children: childrenArr,
                      }
                    : { ...rest, hide, key, label: name, icon: menuIcon[key] || null }
            )
        }
    })

    return arr
}

const MenuComponent = () => {
    const {
        menu: { pageKeys, openKeys, routerList },
        collapsed,
    } = useSelector(state => state[Prefix])
    const [menuList, setMenuList] = useState([])
    const [openedKeys, setOpenedKeys] = useState([])
    const [selectedKeys, setSelectedKeys] = useState([])
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        routerList.length > 0 && setMenuList(filterMenuList(routerList))
    }, [routerList])

    useEffect(() => {
        if (openKeys[openKeys.length - 1] == pageKeys[0]) {
            return setSelectedKeys(pageKeys)
        }
        const arr = [...openKeys]

        arr.slice(0, arr.length - 1)
        setSelectedKeys(arr)
    }, [openKeys, pageKeys])

    // 路由信息更新放在base-layout中处理
    const onMenuClick = ({ keyPath }) => {
        if (menuList.length === 0 || !navigate) {
            return
        }

        const activeMenuArr = getActiveMenusByKey(menuList, keyPath[0])

        // 阻止重复点击
        if (pathname !== activeMenuArr[0]?.path) {
            navigate(activeMenuArr[0]?.path)
        }
    }

    const onMenuOpenChange = openKeys => {
        if (collapsed) {
            return setOpenedKeys(openKeys)
        }
        dispatch(
            Actions.modifyMenuData({
                openKeys: [...openKeys],
            })
        )
    }

    return (
        <Menu
            mode="inline"
            className={style['container']}
            openKeys={collapsed ? openedKeys : openKeys}
            selectedKeys={selectedKeys}
            theme="dark"
            onClick={onMenuClick}
            onOpenChange={onMenuOpenChange}
            items={menuList}
            forceSubMenuRender
        />
    )
}

export default MenuComponent
