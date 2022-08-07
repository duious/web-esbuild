const loadScript = src => {
    return new Promise(function (resolve, reject) {
        const head = document.getElementsByTagName('head')[0]
        const script = document.createElement('script')

        script.onload = function () {
            resolve()
        }

        script.onerror = function (evt) {
            reject(evt)
        }

        script.type = 'text/javascript'
        script.src = src
        head.appendChild(script)
    })
}

let promise = null

export default src => {
    if (!promise) {
        promise = loadScript(src)
    }

    return promise
}
