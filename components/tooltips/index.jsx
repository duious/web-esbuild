import { Popover } from 'antd'
import { QuestionCircleOutlined } from '@ant-design/icons'
import style from './index.scss'

const TooltipsComponent = ({
    title,
    trigger = 'click',
    children = <QuestionCircleOutlined style={{ cursor: 'point' }} />,
}) => (
    <Popover
        destroyTooltipOnHide={{ keepParent: true }}
        content={<div className={style['help-icon-div']}>{title}</div>}
        trigger={trigger}
    >
        {children}
    </Popover>
)

export default TooltipsComponent
