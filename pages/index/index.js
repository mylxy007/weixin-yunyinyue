// pages/index/index.js
import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bannerList: [],
        recommendList: [],
        topList: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
     onLoad(options) {
        this.getData();
    },
    async getData() {
        //获取轮播图数据
        const bannerList = await request('/banner', {
            type: 2
        })
        //更新bannerList数据
        this.setData({
            bannerList: bannerList.banners
        })
        //获取推荐歌曲数据
        const recommendList = await request('/personalized', {
            limit: 10
        })
        //更新recommend数据
        this.setData({
            recommendList: recommendList.result
        })
        //获取排行榜数据
        let index = 0;
        let resultArr = [];
        while (index < 5) {
            const topListData = await request('/top/list', {
                idx: index++
            })
            let topListItem = {
                name: topListData.playlist.name,
                tracks: topListData.playlist.tracks.slice(0, 3)
            }
            resultArr.push(topListItem);
            //更新topList数据
            this.setData({
                topList: resultArr
            })
        }
    },
    //跳转至每日推荐页面
    toRecommendSong() {
        wx.navigateTo({
          url: '/songPackage/pages/recommendSong/recommendSong',
        })
    },
    // 跳转到其他页面
    toOther() {
        wx.navigateTo({
          url: '/otherPackage/pages/other/other',
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},

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