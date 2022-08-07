/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import { Space, Button, Input, Form, Select, Row, Col } from 'antd'
import { sDom } from 'js-simple-utils'
import { useQuery } from '@/hooks'
import style from './index.scss'
import { RESPONSE_CODE } from '@/js/config/request-config'

const FilterComponent = () => {
    const [query, setQuery] = useQuery()
    const [form] = Form.useForm()
    const [markStatusOptions, setMarkStatusOptions] = useState([])

    const initSelectOptions = async () => {
        const { code, data, message } = await Invoke.dataManage.getChatDataSelectOptions()

        if (code == RESPONSE_CODE.SUCCESS) {
            setMarkStatusOptions([{ label: '全部', value: '' }, ...(data?.sourceType || [])])
        } else {
            SMessage.error(message)
        }
    }

    useEffect(() => {
        initSelectOptions()
    }, [])

    useEffect(() => {
        const { sourceType = '', sellId = '', sellName = '' } = query

        form.setFieldsValue({ sourceType, sellId, sellName })
    }, [query])

    const handleFormSubmit = e => {
        sDom.stopAndPrevent(e)
        form.validateFields()
            .then(values => {
                const { sourceType = '', sellId = '', sellName = '' } = values

                setQuery({ sourceType, sellId, sellName, v: new Date().getTime() })
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
                        <Form.Item label="数据来源" name="sourceType">
                            <Select placeholder="请选择数据来源" options={markStatusOptions} allowClear />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item label="经纪人 ID" name="sellId">
                            <Input placeholder="请输入经纪人 ID" allowClear maxLength={20} />
                        </Form.Item>
                    </Col>
                    <Col>
                        <Form.Item label="经纪人姓名" name="sellName">
                            <Input placeholder="请输入经纪人姓名" allowClear maxLength={20} />
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
