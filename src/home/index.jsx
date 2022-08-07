import React from 'react'
import { useSelector } from 'react-redux'
import Content from '@/components/content/index'
import Flow from '@/components/flow/index'
import { Prefix, Actions } from './redux/index'
import style from './index.scss'

const HomeComponent = () => {
    const { positionTree } = useSelector(state => state[Prefix])

    return <Content><Flow /></Content>
}

export default HomeComponent
