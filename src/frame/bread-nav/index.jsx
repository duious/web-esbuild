import React from 'react'
import { useSelector } from 'react-redux'
import { Breadcrumb } from 'antd'
import { Prefix } from '../redux/index.js'

const BreadNavComponent = () => {
    const { activeMenuArr } = useSelector(state => state[Prefix].menu)

    return (
        <Breadcrumb style={{ paddingTop: '1em' }}>
            {activeMenuArr
                ?.map(item => item.name || item.label)
                ?.map(item => (
                    <Breadcrumb.Item key={item}>{item}</Breadcrumb.Item>
                ))}
        </Breadcrumb>
    )
}

export default BreadNavComponent
