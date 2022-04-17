import request from '../../../utils/request'
import PubSub from 'pubsub-js'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        day: '',//天
        month: '',//月
        recommendList: [], //推荐列表数据
        index: 0,   //点击音乐的下标
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //判断用户是否登录
        let userInfo = wx.getStorageSync('userInfo');
        if(!userInfo) {
            wx.showToast({
              title: '请先登录',
              icon: 'none',
              success() {
                  //跳转至登录界面
                  wx.reLaunch({
                    url: '/pages/login/login',
                  })
              }
            })
        }
        //更新日期
        this.setData({
            day: new Date().getDate(),
            month: new Date().getMonth() + 1
        })
        //获取每日推荐数据
        this.getRecommendList();
        //订阅来自songDetail页面发布的消息
        PubSub.subscribe('switchType', (msg, type) => {
            let {recommendList, index} = this.data;
            if(type === 'pre') {
                index = index - 1 < 0 ? recommendList.length - 1 : index - 1;
            } else {
                index = index + 1 > recommendList.length - 1 ? 0 : index + 1;
            }
            let musicId = recommendList[index].id;
            PubSub.publish('musicId', musicId);
            this.setData({
                index
            })
        })
    },
    //获取每日推荐数据
    async getRecommendList() {
        let recommendListData = await request('/recommend/songs');
        this.setData({
            recommendList: recommendListData.recommend
        })
    },
    //跳转至songDetail页面
    toSongDetail(e) {
        let {song, index} = e.currentTarget.dataset;
        this.setData({
            index
        })
        //路由跳转传参：query参数
        wx.navigateTo({
          url: '/songPackage/pages/songDetail/songDetail?musicId=' + song.id,
        //   success: (res) => {
        //       res.eventChannel.emit('toSongDetail', song);
        //   }
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