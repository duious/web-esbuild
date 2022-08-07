import React from 'react'
import Content from '@/components/content/index'
import Filter from './components/filter/index'
import Table from './components/table/index'
import style from './index.scss'

const DataMarkComponent = () => {
    return (
        <Content filter={<Filter />}>
            <Table />
        </Content>
    )
}

export default DataMarkComponent
