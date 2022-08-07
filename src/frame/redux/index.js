import { createAction, createReducer } from '@reduxjs/toolkit'
import { RouterConfig } from '@/js/config/router-config.js'
import { PackageEnv } from '@/js/utils/package-env'
import { RouterList } from '@/custom/router-list'

export const Prefix = 'frame'

const Types = {
    checkAuthComplete: `${Prefix}/checkAuthComplete`,
    modifyUserInfo: `${Prefix}/modifyUserInfo`,
    modifyCollapsed: `${Prefix}/modifyCollapsed`,
    modifyMenuData: `${Prefix}/modifyMenuData`,
}

export const Actions = {
    getRouterList: () => async dispatch => {
        const { code, message, data } = await Invoke.common.getMenuList()

        if (code != RESPONSE_CODE.SUCCESS) {
            return SMessage.error(message)
        }
        const formatRouter = ({ id, name, icon, url, code, childMenus = [] }) => {
            const localData = { ...RouterConfig[code] }

            delete localData.element
            let children = null

            if (childMenus.length > 0) {
                children = childMenus.map(item => formatRouter(item))
            }

            return children
                ? { id, name, icon, key: code, children, path: url, ...localData }
                : { id, name, icon, key: code, path: url, ...localData }
        }

        dispatch(Actions.modifyMenuData({ routerList: data.map(item => formatRouter(item)) }))
    },
    modifyUserInfo: createAction(Types.modifyUserInfo),
    modifyCollapsed: createAction(Types.modifyCollapsed),
    modifyMenuData: createAction(Types.modifyMenuData),
}

const InitialState = {
    breadData: [],
    menu: {
        // routerList: PackageEnv.isDev ? RouterList : [],
        routerList: RouterList,
        pageKeys: ['home'],
        openKeys: ['home'],
        activeMenu: {},
        activeMenuArr: [],
    },
    collapsed: false,
    userInfo: {},
}

// Reducer
export default createReducer(InitialState, builder => {
    builder
        .addCase(Actions.modifyUserInfo, (state, { payload }) => {
            state.userInfo = payload
        })
        .addCase(Actions.modifyCollapsed, state => {
            state.collapsed = !state.collapsed
        })
        .addCase(Actions.modifyMenuData, (state, { payload }) => {
            state.menu = Object.assign(state.menu, payload)
        })
})
