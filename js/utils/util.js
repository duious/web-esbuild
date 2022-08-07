const getStylesNum = val => {
    const strArr = String(val).split(' ')

    return strArr.length === 1
        ? String(strArr[0]).match(/^\d*/g)[0]
        : strArr.map(item => String(item).match(/^\d*/g)[0])
}

/**
 * 转化分页信息为antd的分页信息
 */
const parsePaginationData = ({ totalRecords, totalPages, size, current, sort, hasNext, hasPrevious }) => {
    return {
        hideOnSinglePage: true,
        current: parseInt(current),
        pageSize: parseInt(size),
        total: parseInt(totalRecords),
        totalPages: parseInt(totalPages),
        showQuickJumper: true,
        showSizeChanger: true,
        // sort,
        hasNext,
        // hasPrevious,
    }
}

const validateFieldHasWhitespace = msg => ({
    validator(_, value) {
        if (value && String(value).indexOf(' ') !== -1) {
            return Promise.reject(new Error(msg || '不能有空格！'))
        }

        return Promise.resolve()
    },
})

export { getStylesNum, parsePaginationData, validateFieldHasWhitespace }
