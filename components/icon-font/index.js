import { useEffect } from 'react'
import loadScript from './loadscript.js'
import style from './index.scss'

const ScriptSrc = '//at.alicdn.com/t/font_1453057_r195fpg16sl.js'

const IconFont = props => {
    useEffect(() => {
        loadScript(ScriptSrc)
    }, [])

    return (
        <i className={style['icon-font']} {...props} aria-hidden="true">
            <use xlinkHref={`#${props.type}`}></use>
        </i>
    )
}

export default IconFont
