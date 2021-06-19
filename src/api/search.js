// 搜索相关请求模块
import request from "@/utils/request"

//获取搜索联想建议
export const getSearchSuggestions = q => {
    return request({
        methods: 'GET',
        url: '/app/v1_0/suggestion',
        params: {
            q
        }
    })
}

//获取搜索结果
export const getSearchResult = params => {
    return request({
        methods: 'GET',
        url: '/app/v1_0/search',
        params
    })
}

//获取搜索历史记录
export const getSearchHistories = () => {
    return request({
        methods: 'GET',
        url: '/app/v1_0/search/histories',
    })
}