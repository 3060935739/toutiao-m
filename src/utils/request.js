// 请求模块
import axios from 'axios'
import JSONbig from 'json-bigint'
import store from '@/store/'
import { Toast } from 'vant'
import router from '@/router/'

const refreshTokenReq = axios.create({
    baseURL: 'http://ttapi.research.itcast.cn/',
})

const request = axios.create({
    baseURL: 'http://ttapi.research.itcast.cn/', //基础路径
    transformResponse: [function(data) {
        // Do whatever you want to transform the data
        // axios 默认使用JSON.parse 来转换处理原始的数据
        // 后端返回的数据可能不是JSON格式字符串 JSONbig.parse会报错 所以使用try-catch来捕获异常，防止异常发生
        try {
            // 如果转换成功，返回结果
            return JSONbig.parse(data)
        } catch (err) {
            // 如果转换失败 则进入这里则直接返回
            return data
        }
    }],
})

// 请求拦截器
// Add a request interceptor
request.interceptors.request.use(function(config) {
    // Do something before request is sent
    const { user } = store.state
    if (user) {
        config.headers.Authorization = `Bearer ${user.token}`
    }
    return config;
}, function(error) {
    // Do something with request error
    return Promise.reject(error);
});

// 响应拦截器 Add a response interceptor
request.interceptors.response.use(function(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
}, async function(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    const status = error.response.status
    if (status === 400) {
        // 客服端错误
        Toast.fail('客户端请求参数异常')
    } else if (status === 401) {
        // token 无效
        // 如果没有user或user.token直接去登录
        const { user } = store.state;
        if (!user || !user.token) {
            return redirectLogin()
        }
        // 使用refresh_token请求获取新的token
        try {
            const { data } = await refreshTokenReq({
                method: 'PUT',
                url: '/app/v1_0/authorizations',
                headers: {
                    Authorization: `Bearer ${user.refresh_token}`
                }
            });
            // 拿到新的token之后把它更新到容器中
            user.token = data.data.token
            store.commit('setUser', user);
            // 把失败的请求重新发出去
            // error.config 是本次请求的相关配置对象
            return request(error.config)
        } catch (err) {
            // 刷新token都失败了，直接跳转登录页
            redirectLogin()
        }
    } else if (status === 403) {
        // 没有权限操作
        Toast.fail('没有权限操作')
    } else if (status >= 500) {
        // 服务端异常
        Toast.fail('服务端异常')
    }
    return Promise.reject(error);

});

function redirectLogin() {
    router.replace({
        name: 'login',
        query: {
            redirect: router.currentRoute.fullPath
        }
    })
}

// 导出
export default request