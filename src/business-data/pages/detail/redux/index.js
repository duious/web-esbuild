import { createAction, createReducer } from '@reduxjs/toolkit'
import { RESPONSE_CODE } from '@/js/config/request-config'
import { parsePaginationData } from '@/js/utils/util'

export const Prefix = 'business-data-detail'
const Types = {
    modifyListData: `${Prefix}/modifyListData`, // 获取列表数据
    modifyListLoading: `${Prefix}/modifyListLoading`,
    modifyListQuery: `${Prefix}/modifyListQuery`,
}

export const Actions = {
    loadListData: postData => async (dispatch, store) => {
        const {
            pager: { current = 1, pageSize = 50 },
            listQuery,
        } = store[Prefix]

        dispatch(createAction(Types.modifyListLoading)(true))
        const { code, data, message, ...rest } = await Invoke.dataManage.getChatDetailData({
            ...listQuery,
            page: current,
            pageSize,
            ...postData,
        })

        if (code == RESPONSE_CODE.SUCCESS) {
            dispatch(createAction(Types.modifyListData)({ list: data, pager: parsePaginationData(rest) }))
        } else {
            SMessage.error(message)
        }
        dispatch(createAction(Types.modifyListLoading)(false))
    },
    modifyListQuery: createAction(Types.modifyListQuery),
}

const InitialState = {
    list: [],
    listLoading: false,
    listQuery: {},
    pager: {},
}

// Reducer
export default createReducer(InitialState, builder => {
    builder
        .addCase(Types.modifyListData, (state, { payload }) => {
            state.list = payload.list
            state.pager = payload.pager
        })
        .addCase(Types.modifyListLoading, (state, { payload }) => {
            state.listLoading = payload
        })
        .addCase(Types.modifyListQuery, (state, { payload }) => {
            state.listQuery = payload
        })
})
