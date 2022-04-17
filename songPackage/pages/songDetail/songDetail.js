import request from '../../../utils/request'
import PubSub, { publish } from 'pubsub-js'
import moment from 'moment'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        isPlay: false, //音乐是否播放
        song: {}, //歌曲详情对象
        musicLink: '', //音乐播放链接
        init: '',   //初始化，刚开始没动画
        currentTime: '00:00',   //实时时间
        durationTime: '00:00',  //总时间
        currentWidth: 0, //实时播放时间
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // let eventChannel = this.getOpenerEventChannel();
        // eventChannel.on('toSongDetail', (res) => {
        //     console.log(res);
        // })
        let musicId = options.musicId;
        //获取音乐详情
        this.getMuiscInfo(musicId);

        //如果用户操作系统的控制音乐/暂停的按钮，页面不知道，需要设置监听
        //创建控制音乐播放的实例对象
        this.backgroundAudioManager = wx.getBackgroundAudioManager();
        //监视音乐播放/暂停
        this.backgroundAudioManager.onPlay(() => {
            //修改音乐是否播放的状态
            this.changePlayState(true)
        });
        this.backgroundAudioManager.onPause(() => {
            this.changePlayState(false)
        });
        this.backgroundAudioManager.onStop(() => {
            this.changePlayState(false)
        })
        this.backgroundAudioManager.onTimeUpdate(() => {
            // 格式化实时的播放时间
            let currentTime = moment(this.backgroundAudioManager.currentTime * 1000).format('mm:ss');
            let currentWidth = this.backgroundAudioManager.currentTime / this.backgroundAudioManager.duration * 450;
            this.setData({
                currentTime,
                currentWidth
            })
        })
        //监听音乐自然播放结束
        this.backgroundAudioManager.onEnded(() => {
            //自动播放下一首
            PubSub.publish('switchType', 'next');
            this.setData({
                currentWidth: 0,
                currentTime: '00:00'
            })
        })
         //订阅来自recommendSong页面发布的musicId消息
         PubSub.subscribe('musicId', (msg, musicId) => {
            this.getMuiscInfo(musicId);
        })
    },
    //修改播放状态的功能函数
    changePlayState(isPlay) {
        //修改音乐是否的状态
        this.setData({
            isPlay
        })
    },
    // 点击播放或暂停的状态
    handleMusicPlay() {
        let isPlay = !this.data.isPlay;
        let musicLink = this.data.musicLink;
        this.musicControl(isPlay, musicLink)
    },
    //获取音乐详情的功能函数
    async getMuiscInfo(musicId) {
        this.setData({
            init: 'init'
        })
        let songData = await request('/song/detail', {ids: musicId});
        let durationTime = moment(songData.songs[0].dt).format('mm:ss');
        this.setData({
            song: songData.songs[0],
            isPlay: true,
            init: '',
            durationTime,
        })
        //动态修改窗口标题
        wx.setNavigationBarTitle({
          title: this.data.song.name,
        })
        this.musicControl(true, this.data.musicLink)
    },
    //控制音乐播放/暂停的功能函数
    async musicControl(isPlay, musicLink) {
        if(isPlay) {
            if(!musicLink) {
                 //获取音乐的播放连接
                let musicLinkData = await request('/song/url', {id: this.data.song.id});
                musicLink = musicLinkData.data[0].url;
                this.setData({
                    musicLink
                })
            }
            //播放音乐
            this.backgroundAudioManager.title = this.data.song.name;
            this.backgroundAudioManager.src = musicLink;
        } else {
            this.backgroundAudioManager.pause();
        }
    },
    handleSwitch(e) {
        //每次切歌时，先把磁盘暂停
        this.setData({
            isPlay: false,
            musicLink: '',
        })
        //获取切歌的类型
        let type = e.currentTarget.id;
        //发送消息数据给recommendSong页面
        PubSub.publish('switchType', type);
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
         //取消订阅
         PubSub.unsubscribe('musicId');
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