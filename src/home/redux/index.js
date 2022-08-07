import { createAction, createReducer } from '@reduxjs/toolkit'

export const Prefix = 'home'
const Types = {
    getPositionLevel: `${Prefix}/getPositionLevel`, // 获取一级职类
    getAllPosition: `${Prefix}/getAllPosition`, // 获取全部职类
}

export const Actions = {
    getPositionLevel: () => async dispatch => {
        const { status, data, message } = await Invoke.position.getPosition()

        if (status == 1) {
            dispatch(createAction(Types.getPositionLevel)(data))
        } else {
            SMessage.error(message)
        }
    },
}

const InitialState = {
    level1: [],
    positionTree: [],
}

// Reducer
export default createReducer(InitialState, builder => {
    builder.addCase(Types.getPositionLevel, (state, { payload }) => {
        state.level1 = payload
    })
})
