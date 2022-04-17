import request from '../../utils/request'
let startY = 0; //手指起始的坐标
let moveY = 0; //手指移动的坐标
let moveDistance = 0; //手指移动的距离
Page({

    /**
     * 页面的初始数据
     */
    data: {
        coverTransform: 'translateY(0)',
        coverTransition: '',
        userInfo: {}, //用户信息
        recentPlayList: [], //用户播放记录
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //读取用户的基本信息
        let userInfo = wx.getStorageSync('userInfo');
        if (userInfo) {
            this.setData({
                userInfo,
            })
        }
        //获取用户播放记录
        this.getUserRecentPlayList(this.data.userInfo.userId)
    },
    //获取用户播放记录函数
    async getUserRecentPlayList(userId) {
        let recentPlayListData = await request('/user/record', {uid: userId, type: 0}) 
        this.setData({
            recentPlayList: recentPlayListData.allData.slice(0, 10)
        })
    },
    handleTouchStart(e) {
        this.setData({
            coverTransition: ''
        })
        //获取手指起始坐标
        startY = e.touches[0].clientY;
    },
    handleTouchMove(e) {
        //获取手指移动坐标
        moveY = e.touches[0].clientY;
        moveDistance = parseInt(moveY - startY);
        if (moveDistance <= 0)
            return;
        if (moveDistance >= 80)
            moveDistance = 80;
        //动态更新coverTransform的值
        this.setData({
            coverTransform: `translateY(${moveDistance}rpx)`
        })
    },
    handleTouchEnd() {
        this.setData({
            coverTransition: 'transform .5s linear',
            coverTransform: "translateY(0)"
        })
    },
    //跳转至登录login页面的回调
    toLogin() {
        wx.navigateTo({
            url: '/pages/login/login'
        })
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