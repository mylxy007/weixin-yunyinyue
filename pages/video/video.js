import request from '../../utils/request'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        videoGroupList: [], //导航标签数据
        navId: '',  //导航标识
        videoList: [], //视频列表数据
        videoId: '', //视频id标识
        videoUpdateTime: [], //记录video播放的时长
        isTriggered: false, //表示下拉刷新是否触发
        offset: 1,//表示当前视频列表是第几页
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        //获取导航数据
        this.getVideoGroupListData();
    },
    //获取导航数据
    async getVideoGroupListData() {
        const result = await request('/video/group/list');
        this.setData({
            videoGroupList: result.data.slice(0, 14),
            navId: result.data[0].id
        })
        this.getVideoList(this.data.navId);
    },
    //获取视频列表数据
    async getVideoList(navId) {
        let videoListData = await request('/video/group', {id: navId});
        wx.hideLoading();
        let index = 0;
        let videoList = videoListData.datas.map(item => {
            item.id = index++;
            return item;
        })
        this.setData({
            videoList,
            isTriggered: false, //关闭下拉刷新
        })
    },
    //改变导航标识
    changeNav(e) {
        let navId = e.target.id;
        this.setData({
            navId: navId*1,
            videoList: []
        })
        wx.showLoading({
            title: '正在加载'
        })
        this.getVideoList(this.data.navId);
    },
    //点击播放/继续播放的回调
    handlePlay(e) {
        //解决多个视频同时播放的问题
        let vid = e.currentTarget.id;
        //播放视频时，关闭上一个视频
        this.videoContext && this.vid !== vid && this.videoContext.stop();
        //创建控制video标签的实例对象
        this.videoContext = wx.createVideoContext(vid);
        this.vid = vid;
        this.setData({
            videoId: vid
        })
        //判断当前的视频之前是否播放过，是否有播放记录,如果有，跳转至指定的播放位置
        let {videoUpdateTime} = this.data;
        let videoItem = videoUpdateTime.find(item => vid === item.vid);
        if(videoItem) {
            this.videoContext.seek(videoItem.currentTime);
        }
    },
    //监听视频播放进度的回调
    handleTimeUpdate(e) {
            let videoTimeObj = {vid: e.currentTarget.id, currentTime: e.detail.currentTime}
            let {videoUpdateTime} = this.data;
            //判断数组中是否存在
            let videoItem = videoUpdateTime.find(item => item.vid === videoTimeObj.vid);
            if(videoItem) {
                videoItem.currentTime = e.detail.currentTime;
            } else {
                videoUpdateTime.push(videoTimeObj);
            }
            //更新videoUpdateTIme的数据
            this.setData({
                videoUpdateTime
            })
    },
    //播放结束时调用
    handleEnded(e) {
        let vid = e.currentTarget.id;
        let {videoUpdateTime} = this.data;
        let index = videoUpdateTime.findIndex(item => item.vid === vid);
        videoUpdateTime.splice(index, 1);
        this.setData({
            videoUpdateTime
        })
    },
    //下拉刷新事件
    handleRefresher() {
        this.getVideoList(this.data.navId);
    },
    //自定义上拉触底的回调
    async handleToLower() {
        console.log('上拉刷新');
        //数据分页：1.后端分页；2.前端分页
        let {offset, navId} = this.data; 
        //获取新的数据
        let newVideoListData = await request('/video/group', {id: navId, offset: ++offset});
        let index = (offset - 1) * 8;
        let newvideoList = newVideoListData.datas.map(item => {
            item.id = index++;
            return item;
        })
        let {videoList} = this.data;
        //添加到原数据中
        videoList.push(...newvideoList);
        this.setData({
            videoList,
            offset
        })
    },
    // 跳转到搜索界面
    toSearch() {
        wx.navigateTo({
          url: '/pages/search/search',
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
    onShareAppMessage({from}) {
        console.log(from);
        if(from === 'button') {
            return {
                title: '来自button的转发',
                path: '/pages/video/video',
                imageUrl: '/static/images/nvsheng.jpg'
            }
        } else {
            return {
                title: '来自menu的转发',
                path: '/pages/video/video',
                imageUrl: '/static/images/nvsheng.jpg'
            }
        }
    }
})