import { Typography } from 'antd'
import { useState } from 'react'
import Tooltips from '@/components/tooltips'
import styles from './index.scss'

const isNeedTooltips = (title, component, isEllipsis) =>
    title && title != '--' && isEllipsis ? (
        <Tooltips title={title} trigger="hover">
            {component}
        </Tooltips>
    ) : (
        component
    )

const MultilineComponent = ({
    rows = 1,
    suffix,
    expandable = false,
    title = '',
    children,
    style = {},
    className = '',
}) => {
    const [isEllipsis, setIsEllipsis] = useState(false)

    return isNeedTooltips(
        title,
        <Typography.Paragraph
            className={`${style['multiline-div']} ${className}`}
            ellipsis={{
                rows,
                expandable,
                suffix,
                onEllipsis: setIsEllipsis,
            }}
            style={style}
        >
            {children}
        </Typography.Paragraph>,
        isEllipsis
    )
}

export default MultilineComponent
