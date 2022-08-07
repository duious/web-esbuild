/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch, useStore } from 'react-redux'
import { Table } from 'antd'
import Multiline from '@/components/multiline'
import { useQuery } from '@/hooks'
import style from './index.scss'
import { Prefix, Actions } from '../../redux'

const SOURCE_TYPE_TEXT = {
    1: '外呼电话',
    2: '聊天',
}

const DataMarkComponent = () => {
    const { list, listLoading, pager } = useSelector(state => state[Prefix])
    const store = useStore()
    const [query, setQuery] = useQuery()
    const dispatch = useDispatch()
    const { id } = useParams()
    const { sourceType = '', sellId = '', sellName = '', page = 1, pageSize = 50 } = query

    const loadListData = () => {
        Actions.loadListData({ page, pageSize })(dispatch, store.getState())
    }

    useEffect(() => {
        dispatch(Actions.modifyListQuery({ geekId: id, sourceType, sellId, sellName, page, pageSize }))
        loadListData()
    }, [query])

    const handleTablePageChange = (page, pageSize) => {
        setQuery({ sourceType, sellId, sellName, page, pageSize })
    }

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            width: 80,
        },
        {
            title: '数据来源',
            dataIndex: 'sourceType',
            width: 90,
            render: text => SOURCE_TYPE_TEXT[text] || '--',
        },
        {
            title: '经纪人ID',
            dataIndex: 'sellId',
            width: 90,
            render: text => text || '--',
        },
        {
            title: '经纪人姓名',
            dataIndex: 'sellName',
            width: 120,
            render: text => text || '--',
        },
        {
            title: '发送人姓名',
            dataIndex: 'userName',
            width: 120,
            render: text => text || '--',
        },
        {
            title: '消息内容',
            dataIndex: 'content',
            render: text => (
                <Multiline rows={2} title={text || '--'} style={{ maxWidth: '560px', minWidth: '100px' }}>
                    {text || '--'}
                </Multiline>
            ),
        },
        {
            title: '消息时间',
            dataIndex: 'chatTimeFormat',
            width: 180,
            render: text => text || '--',
        },
    ]

    return (
        <div className={style['table-div']}>
            <Table
                dataSource={list}
                columns={columns}
                loading={listLoading}
                sticky
                scroll={{ x: 'max-content' }}
                rowKey={record => `${record.id}-${record.addTimeFormat}`}
                pagination={{ ...pager, onChange: handleTablePageChange }}
            />
        </div>
    )
}

export default DataMarkComponent
