/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Space, Button, Form, Select, Row, Col, Input } from 'antd'
import { sDom } from 'js-simple-utils'
import { useQuery } from '@/hooks'
import style from './index.scss'
import { RESPONSE_CODE } from '@/js/config/request-config'

const FilterComponent = () => {
    const [query, setQuery] = useQuery()
    const [form] = Form.useForm()
    const [dataSourceOptions, setDataSourceOptions] = useState([])

    const initSelectOptions = async () => {
        const { code, data, message } = await Invoke.dataManage.getChatDataSelectOptions()

        if (code == RESPONSE_CODE.SUCCESS) {
            setDataSourceOptions(data?.dataSource || [])
        } else {
            SMessage.error(message)
        }
    }

    useEffect(() => {
        initSelectOptions()
    }, [])

    useEffect(() => {
        const { dataSource = undefined, geekId = '', geekName = '' } = query

        form.setFieldsValue({
            dataSource: dataSource == '' ? undefined : dataSource,
            geekId,
            geekName,
        })
    }, [query])

    const handleFormSubmit = e => {
        sDom.stopAndPrevent(e)
        form.validateFields()
            .then(values => {
                const { dataSource = '', geekId = '', geekName = '' } = values

                setQuery({ dataSource, geekId, geekName, v: new Date().getTime() })
            })
            .catch(() => {})
    }

    const handleFormReset = e => {
        sDom.stopAndPrevent(e)
        setQuery({})
    }

    return (
        <div className={style['filter-div']}>
            <Form form={form}>
                <Row gutter={24}>
                    <Col>
                        <Form.Item label="数据来源" name="dataSource">
                            <Select placeholder="请选择数据来源" options={dataSourceOptions} allowClear />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item label="客户 ID" name="geekId">
                            <Input placeholder="请输入客户 ID" allowClear maxLength={20} />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item label="客户姓名" name="geekName">
                            <Input placeholder="请输入客户姓名" allowClear maxLength={20} />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item>
                            <Space>
                                <Button type="primary" onClick={handleFormSubmit}>
                                    查询
                                </Button>
                                <Button type="default" onClick={handleFormReset}>
                                    重置
                                </Button>
                            </Space>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
    )
}

export default FilterComponent
