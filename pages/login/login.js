import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        phone: '17674540184', //手机号
        password: '2668640009a', //密码 
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

    },
    //登录的回调
    async login() {
        //1.手机表单项数据
        let {
            phone,
            password
        } = this.data;
        //2.前端验证
        if (!phone) {
            //提示用户
            wx.showToast({
                title: '手机号不能为空',
                icon: 'none'
            })
            return;
        } else {
            //定义正则表单时
            let phoneReg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/
            if (!phoneReg.test(phone)) {
                wx.showToast({
                    title: '手机号格式错误',
                    icon: 'none'
                })
                return;
            }
        }
        if (!password) {
            wx.showToast({
                title: '密码不能为空',
                icon: 'none'
            })
            return;
        }
        //3.后端验证
        const result = await request('/login/cellphone', {
            phone,
            password,
            isLogin: true
        })
        if (result.code === 200) {
            //登录成功
            wx.showToast({
                title: '登录成功',
                icon: 'success'
            })
            //将用户的信息存储至本地
            wx.setStorageSync('userInfo', result.profile);
            //跳转至个人中心personal页面
            wx.reLaunch({
              url: '/pages/personal/personal',
            })
        } else if (result.code === 400) {
            wx.showToast({
                title: '手机号错误',
                icon: 'none'
            })
        } else if (result.code === 502) {
            wx.showToast({
                title: '密码错误',
                icon: 'none'
            })
        } else {
            wx.showToast({
                title: '登录失败，请重新登录',
            })
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})