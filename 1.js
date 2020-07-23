import axios from 'axios'
import store from '@/store'
import qs from 'qs'
import { Spin } from 'iview'
const addErrorLog = errorInfo => {
    const { statusText, status, request: { responseURL } } = errorInfo
    let info = {
        type: 'ajax',
        code: status,
        mes: statusText,
        url: responseURL
    }
    if (!responseURL.includes('save_error_logger')) store.dispatch('addErrorLog', info)
}

class HttpRequest {
    constructor (baseUrl = baseURL) {
        this.baseUrl = baseUrl
        this.queue = {}
    }
    getInsideConfig(url) {
        const config = {
            baseURL: this.baseUrl,
            headers: {
            }
        }
        if (url !== 'login' && store.state.user.token) {
            config.headers['Authorization'] = 'Bearer ' + store.state.user.token
        }
        return config
    }
    destroy(url) {
        delete this.queue[url]
        if (!Object.keys(this.queue).length) {
            Spin.hide()
        }
    }
    interceptors(instance, url) {
        // 请求拦截
        instance.interceptors.request.use(config => {
            // 添加全局的loading...
            if (!Object.keys(this.queue).length) {
                Spin.show() // 不建议开启，因为界面不友好
            }
            this.queue[url] = true
            if (config.method === 'post') {
                config.data = qs.stringify(config.data)
                // config.headers.common['Authorization'] = 'Bearer 111'
                config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
            }
            return config
        }, error => {
            return Promise.reject(error)
        })
        // 响应拦截
        instance.interceptors.response.use(res => {
            this.destroy(url)
            const { data, status } = res
            return { data, status }
        }, error => {
            this.destroy(url)
            let errorInfo = error.response
            if (!errorInfo) {
                const { request: { statusText, status }, config } = JSON.parse(JSON.stringify(error))
                errorInfo = {
                    statusText,
                    status,
                    request: { responseURL: config.url }
                }
            }
            addErrorLog(errorInfo)
            return Promise.reject(error)
        })
    }
    request(options) {
        const instance = axios.create()
        options = Object.assign(this.getInsideConfig(options.url), options)
        this.interceptors(instance, options.url)
        return instance(options)
    }
}
export default HttpRequest