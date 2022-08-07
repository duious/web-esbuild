/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch, useStore } from 'react-redux'
import { Table } from 'antd'
import { useQuery } from '@/hooks'
import style from './index.scss'
import { Prefix, Actions } from '../../redux'

const DataMarkComponent = () => {
    const { list, pager, listLoading } = useSelector(state => state[Prefix])
    const store = useStore()
    const [query, setQuery] = useQuery()
    const { dataSource = '', geekId = '', geekName = '', page = 1, pageSize = 50 } = query
    const dispatch = useDispatch()

    const loadListData = () => {
        Actions.loadListData({ dataSource, geekId, geekName, page, pageSize })(dispatch, store.getState())
    }

    useEffect(() => {
        loadListData()
    }, [query])

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 80,
        },
        {
            title: '数据来源',
            dataIndex: 'dataSourceDesc',
            render: text => text || '--',
        },
        {
            title: '客户ID',
            dataIndex: 'geekId',
            render: text => text || '--',
        },
        {
            title: '客户姓名',
            dataIndex: 'geekName',
            render: text => text || '--',
        },
        {
            title: '最后同步时间',
            dataIndex: 'lastestTimeFormat',
            render: text => text || '--',
        },
        {
            title: '操作',
            width: 90,
            fixed: 'right',
            render: (_text, item) => <Link to={`/business-data/detail/${item.geekId}`}>查看</Link>,
        },
    ]

    const handleTablePageChange = (page, pageSize) => {
        setQuery({ dataSource, geekId, geekName, page, pageSize })
    }

    return (
        <div className={style['table-div']}>
            <Table
                dataSource={list}
                columns={columns}
                loading={listLoading}
                sticky
                scroll={{ x: 'max-content' }}
                rowKey={record => `${record.id}-${record.conversationDuration}`}
                pagination={{ ...pager, onChange: handleTablePageChange }}
            />
        </div>
    )
}

export default DataMarkComponent
