import { Link } from 'react-router-dom'
import Content from '@/components/content/index'
import style from './index.scss'

const NotFoundComponent = () => {
    return (
        <Content>
            <div className={style['page-div']}>
                <div className="main">
                    <img src="https://img.kanzhun.com/web/kanzhun/16118155516620.png" alt="" />
                    <div className="big-title">哎呀，我们没办法找到这个页面了</div>
                    <div className="sub-title">请检查您输入的网址是否正确，或者点击链接继续浏览</div>
                    <div className="link-title">
                        您可以回到<Link to="/">首页</Link>
                    </div>
                </div>
            </div>
        </Content>
    )
}

export default NotFoundComponent
