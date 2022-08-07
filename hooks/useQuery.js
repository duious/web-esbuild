/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { sUrl } from 'js-simple-utils'

function useQuery() {
    const { search = '', pathname } = useLocation()
    const [query, setQuery] = useState(sUrl.parseSearchQuery(search || ''))
    const [isMounted, setIsMounted] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        setIsMounted(true)
    }, [])

    useEffect(() => {
        const newQuery = search.length > 0 ? sUrl.parseSearchQuery(search) : {}

        // if (sUrl.stringifySearchQuery(newQuery) != sUrl.stringifySearchQuery(query)) {
        if (!Object.is(newQuery, query)) {
            isMounted && setQuery(newQuery)
        }
    }, [search])

    const updateQuery = data => {
        navigate(`${pathname}?${sUrl.stringifySearchQuery(data)}`)
    }

    return [query, updateQuery]
}

export default useQuery
