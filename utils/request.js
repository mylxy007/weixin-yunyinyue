// 发送ajax请求
import config from './config'
export default (url, data = {}, method = 'get') => {
    return new Promise((resolve, reject) => {
        wx.request({
            url: config.host + url,
            data,
            method,
            header: {
                cookie: wx.getStorageSync('cookies')? wx.getStorageSync('cookies').find(item => item.indexOf('MUSIC_U') !== -1) : ''
            },
            success(res) {
                //登录请求
                if(data.isLogin) {
                    //将用户的cookies保存到本地
                    wx.setStorage({key: 'cookies', data: res.cookies})
                }
                resolve(res.data)
            },
            fail(err) {
                reject(err)
            }
        })
    })
}