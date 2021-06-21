import request from "@/utils/request"


//登录
export const login = data => {
    return request({
        method: 'POST',
        url: '/app/v1_0/authorizations',
        data
    })
}

//发送短信验证码
export const sendSms = mobile => {
    return request({
        method: 'GET',
        url: `/app/v1_0/sms/codes/${mobile}`,
    })
}

//获取登录用户信息
export const getCurrentUser = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/user',
        // headers: {
        //     Authorization: `Bearer ${store.state.user.token}`
        // }
    })
}

//获取用户频道列表
export const getUserChannels = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/user/channels',
    })
}

//获取全部频道列表
export const getChannels = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/channels',
    })
}

//修改我的频道列表
export const addUserChannel = data => {
    return request({
        method: 'PATCH',
        url: '/app/v1_0/user/channels',
        data
    })
}

//删除用户指定频道
export const deleteUserChannel = channelID => {
    return request({
        method: 'DELETE',
        url: `/app/v1_0/user/channels/${channelID}`,
    })
}

//关注用户
export const addFollow = userId => {
    return request({
        methods: 'POST',
        url: '/app/v1_0/user/followings',
        data: {
            target: userId
        }
    })
}

//取消关注
export const deleteFollow = userId => {
    return request({
        method: 'DELETE',
        url: `/app/v1_0/user/followings/${userId}`
    })
}

//获取用户个人资料
export const getUserProfile = () => {
    return request({
        method: 'GET',
        url: '/app/v1_0/user/profile',
    })
}

//编辑用户个人资料
export const updateUserProfile = data => {
    return request({
        method: 'PATCH',
        url: '/app/v1_0/user/profile',
        data
    })
}

//编辑用户照片资料
export const updateUserPhoto = data => {
    return request({
        method: 'PATCH',
        url: '/app/v1_0/user/photo',
        data
    })
}