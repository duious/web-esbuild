import React from 'react'
import { Divider } from 'antd'
import style from './index.scss'

/**
 * 页面布局组件
 * @description children默认与content组件相同
 * @param {React.DOMElement} filter 过滤组件
 * @param {React.DOMElement} content 内容组件
 * @param {React.DOMElement} children 子组件
 * @param {React.DOMElement} filterClass 过滤组件class
 * @param {React.DOMElement} contentClass 内容组件class
 * @param {React.DOMElement} filterStyle 过滤组件style
 * @param {React.DOMElement} contentStyle 内容组件style
 * @returns {React.DOMElement}
 */
const FilterComponent = ({
    children,
    prefixTabs,
    suffixTabs,
    filter,
    content,
    prefixTabsClass = '',
    filterClass = '',
    suffixTabsClass = '',
    contentClass = '',
    prefixTabsStyle = {},
    filterStyle = {},
    suffixTabsStyle = {},
    contentStyle = {},
}) => {
    return (
        <div className={style['page-content']}>
            {prefixTabs && (
                <div className={`tabs-div ${prefixTabsClass}`} style={prefixTabsStyle}>
                    {prefixTabs}
                </div>
            )}
            {prefixTabs && filter && <Divider />}
            {filter && (
                <div className={`filter-div ${filterClass}`} style={filterStyle}>
                    {filter}
                </div>
            )}
            {suffixTabs && filter && <Divider />}
            {suffixTabs && (
                <div className={`tabs-div ${suffixTabsClass}`} style={suffixTabsStyle}>
                    {suffixTabs}
                </div>
            )}
            <div className={`content-div ${contentClass}`} style={contentStyle}>
                {content}
                {children}
            </div>
        </div>
    )
}

export default FilterComponent
