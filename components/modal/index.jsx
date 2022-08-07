import React from 'react'
import { Button, Modal, Space, Spin, PageHeader } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import { sFunction } from 'js-simple-utils'
import style from './index.scss'
import { getStylesNum } from '@/js/utils/util'

/**
 * model组件
 * @description 默认宽度左右各加24，最小宽度648
 * @param {String|React.DOMElement} title 标题
 * @param {React.DOMElement} children 子组件
 * @param {Boolean} visible 展示
 * @param {Boolean} closable 关闭按钮
 * @param {Function} onOk 确认按钮点击事件
 * @param {Function} onCancel 取消按钮点击事件
 * @param {String} contentClass 自定义class
 * @param {React.CSSProperties} contentStyle 自定义样式
 * @param {String} okText 确定按钮文本
 * @param {String} cancelText 取消按钮文本
 * @param {'all'|'ok'|'cancel'} footer 是否展示确定取消按钮
 * @param {Boolean} loading 是否是loading
 * @returns {React.DOMElement}
 */
const ModalComponent = ({
    title,
    children,
    visible,
    closable = true,
    onOk = sFunction.noop,
    onCancel = sFunction.noop,
    contentClass = '',
    contentStyle = { width: '400px' },
    okText = '确定',
    cancelText = '取消',
    footer = 'all',
    loading = false,
    getContainer = false,
}) => (
    <Modal
        visible={visible}
        closable={false}
        destroyOnClose
        onCancel={onCancel}
        footer={null}
        getContainer={getContainer}
        width={Number(getStylesNum(contentStyle.width)) < 600 ? 648 : Number(getStylesNum(contentStyle.width)) + 48}
        bodyStyle={{ padding: '0 0' }}
    >
        <Spin spinning={loading}>
            <PageHeader
                title={title}
                extra={[
                    closable ? (
                        <CloseOutlined key="closeIcon" onClick={onCancel} style={{ cursor: 'pointer' }} />
                    ) : null,
                ]}
            />
            <div className={`${style['content-div']} ${contentClass}`} style={contentStyle}>
                {children}
            </div>

            <Space style={{ width: '100%', justifyContent: 'center', marginBottom: '24px' }}>
                {(footer === 'all' || footer === 'ok') && (
                    <Button type="primary" onClick={onOk}>
                        {okText}
                    </Button>
                )}
                {(footer === 'all' || footer === 'cancel') && (
                    <Button type="default" onClick={onCancel}>
                        {cancelText}
                    </Button>
                )}
            </Space>
        </Spin>
    </Modal>
)

export default ModalComponent
