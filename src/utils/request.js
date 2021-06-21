// 请求模块
import axios from 'axios'
import JSONbig from 'json-bigint'
import store from '@/store/'

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

//请求拦截器
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

//响应拦截器

//导出
export default request