import { message } from 'antd'

message.config({
    maxCount: 1,
})

const msgInstance = {
    loading: (text, duration, onClose) => {
        return message.success(text || 'Loading...', duration, onClose)
    },
    success: (text, duration, onClose) => {
        return message.success(text || '操作成功', duration, onClose)
    },
    error: (text, duration, onClose) => {
        return message.error(text || '操作失败', duration, onClose)
    },
    info: (text, duration, onClose) => {
        return message.info(text || '', duration, onClose)
    },
    destroy: () => {
        return message.destroy()
    },
}

export default msgInstance
