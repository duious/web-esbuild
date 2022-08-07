import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Avatar, Dropdown, Menu, Typography, Button } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined } from '@ant-design/icons'
import { sCookie } from 'js-simple-utils'
import LogoSvg from '@/components/logo/index'
import LogoMiniSvg from '@/components/logo/mini'
import style from './index.scss'
import { Prefix, Actions } from '../redux/index'

const HeaderComponent = () => {
    const { userInfo, collapsed } = useSelector(state => state[Prefix])
    const dispatch = useDispatch()

    const setCollapsed = val => {
        dispatch(Actions.modifyCollapsed(val))
    }

    const logout = async () => {
        const { code, message, data } = await Invoke.common.getLogout()

        if (code != RESPONSE_CODE.SUCCESS) {
            return SMessage.error(message)
        }
        sCookie.delItem('t_chatbot')
        dispatch(Actions.modifyUserInfo({ ...data }))
        window.location.href = '/'
    }

    const onMenuItemClick = ({ key }) => {
        switch (key) {
            case 'logout':
                Modal.confirm({
                    title: '确定要退出登录吗',
                    onOk: () => {
                        logout()
                    },
                })
                break
            default:
                break
        }
    }

    return (
        <div className={style['kz-header']}>
            <Link className="header-logo" to="/">
                {collapsed ? (
                    <div className="header-title" style={{ width: 80 }}>
                        <LogoMiniSvg width={64} />
                    </div>
                ) : (
                    <div className="header-title">
                        <LogoSvg style={{ margin: '0 16px', padding: '0 20px 0 8px' }} />
                    </div>
                )}
            </Link>
            <div className="header-content">
                <div className="content-left">
                    <Button className="collapsed-div" type="link" onClick={() => setCollapsed(!collapsed)}>
                        {collapsed ? <MenuUnfoldOutlined className="icon" /> : <MenuFoldOutlined className="icon" />}
                    </Button>
                </div>
                <div className="content-right">
                    <Dropdown overlay={<Menu onClick={onMenuItemClick} items={[{ label: '退出', key: 'logout' }]} />}>
                        <div className="login-info-div">
                            {userInfo?.bossHiAvatar ? (
                                <Avatar size="large" src={userInfo?.bossHiAvatar} />
                            ) : (
                                <Avatar size="large" icon={<UserOutlined />} />
                            )}
                            <Typography.Text className="user-name">{userInfo?.name || '用户名称'}</Typography.Text>
                        </div>
                    </Dropdown>
                </div>
            </div>
        </div>
    )
}

export default HeaderComponent
