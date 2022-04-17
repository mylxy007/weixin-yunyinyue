import request from '../../utils/request'
let timer = null; //防抖
Page({

    /**
     * 页面的初始数据
     */
    data: {
        placeholderContent: '', //placeholder默认的内容
        hotList: [], //热搜榜数据
        searchContent: '', //搜索关键字
        searchList: [], //关键字模糊匹配的数据
        historyList: [], //搜索历史记录
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // 获取初始化数据
        this.getInitData();
        // 获取历史记录
        this.getSearchHistory();
    },
    async getInitData() {
        let placeholderData = await request('/search/default');
        let hotList = await request('/search/hot/detail')
        this.setData({
            placeholderData: placeholderData.data.showKeyword,
            hotList: hotList.data
        })
    },
    // 获取本地历史记录的函数
    getSearchHistory() {
        let historyList = wx.getStorageSync('searchHistory') || [];
        this.setData({
            historyList
        })
    },
    // 表单项内容发生改变的回调
    handleInputChange() {
        clearTimeout(timer);
        timer = setTimeout(() => {
            this.getSearchListData();
        }, 500)
        
    },
    async getSearchListData() {
        if(!this.data.searchContent) {
            this.setData({
                searchList: []
            })
            return;
        }
        let {historyList, searchContent} = this.data;
        //发请求来获取关键字模糊匹配数据
        let searchListData = await request(`/search`, {keywords: searchContent, limit: 10});
        this.setData({
            searchList: searchListData.result.songs
        })
        // 将搜索的关键字添加到搜索历史记录中
        let index = historyList.indexOf(searchContent);
        index !== -1 && historyList.splice(index, 1);
        historyList.unshift(searchContent);
        this.setData({
            historyList
        })
        wx.setStorageSync('searchHistory', historyList);
    },
    // 清空搜索内容
    clearSearchContent() {
        this.setData({
            searchContent: '',
            searchList: []
        })
    },
    // 删除搜索历史记录
    deleteSearchHistory() {
        // 询问是否删除
        wx.showModal({
            title:'提示',
            content: '确认删除吗？',
            success: (res) => {
                if(res.confirm) {
                    // 清空data中的historyList 和 本地存储的searchHistory
                    wx.removeStorageSync('searchHistory');
                     this.setData({
                        historyList: []
                    })
                }
            }
        })
    },
    // 跳转到视频界面
    toVideo() {
        wx.reLaunch({
          url: '/pages/video/video',
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