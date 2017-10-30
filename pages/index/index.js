//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    j: 1,//帧动画初始图片
    isSpeaking: false,//是否正在说话
    voices: [],//音频数组
    a:false,
    openid:"",
    room_id:"",
    src:""
  },
  onLoad: function () {
    console.log(app.globalData.userInfo)
  },
  //手指按下
  touchdown: function () {
    console.log("手指按下了...")
    console.log("new date : " + new Date)
    var _this = this;
    speaking.call(this);
    this.setData({
      isSpeaking: true
    })
    if (this.data.isSpeaking){
      //开始录音
      wx.startRecord({
        success: function (res) {
          //临时路径,下次进入小程序时无法正常使用
          _this.setData({
            src: res.tempFilePath
          })
          console.log("录音成功准备发送");
          wx.uploadFile({
            url: 'http://m.qu6.wang/bns/room/upload_audio', //仅为示例，非真实的接口地址
            filePath: res.tempFilePath,
            name: 'file',
            formData: {
              'user': 'test',
              'openid': _this.data.openid,
              'room_id': _this.data.room_id
            },
            success: function (res) {
              var data = res.data
              console.log("发送过去了");
              console.log(res);
              //do something
            },
            fail: function () {
              console.log(123)
            }
          })
          //持久保存
          // wx.saveFile({
          //   tempFilePath: tempFilePath,
          //   success: function (res) {
          //     //持久路径
          //     //本地文件存储的大小限制为 100M
          //     savedFilePath = res.savedFilePath;
          //     console.log("savedFilePath: " + savedFilePath);
          //     _this.setData({
          //       a:true
          //     })
          //   }
          // })
          wx.showToast({
            title: '恭喜!录音成功',
            icon: 'success',
            duration: 1000
          })


          // //获取录音音频列表
          // wx.getSavedFileList({
          //   success: function (res) {
          //     var voices = [];
          //     for (var i = 0; i < res.fileList.length; i++) {
          //       //格式化时间
          //       var createTime = new Date(res.fileList[i].createTime)
          //       //将音频大小B转为KB
          //       var size = (res.fileList[i].size / 1024).toFixed(2);
          //       var voice = { filePath: res.fileList[i].filePath, createTime: createTime, size: size };
          //       console.log("文件路径: " + res.fileList[i].filePath)
          //       console.log("文件时间: " + createTime)
          //       console.log("文件大小: " + size)
          //       voices = voices.concat(voice);
          //     }
          //     _this.setData({
          //       voices: voices
          //     })
          //   }
          // })
        },
        fail: function (res) {
          //录音失败
          wx.showModal({
            title: '提示',
            content: '录音的姿势不对!',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                console.log('用户点击确定')
                return
              }
            }
          })
        }
      })
    }
  },
  //手指抬起
  touchup: function () {
    console.log("手指抬起了...");
    this.setData({
      isSpeaking:false
    })
    clearInterval(this.timer);
    if (!this.data.isSpeaking){
      wx.stopRecord();
    }
  },
  openIdchange(e){
    this.setData({
      openid: e.detail.value
    })
    console.log(e);
  },
  roomIdchange(e) {
    this.setData({
      room_id: e.detail.value
    })
    console.log(e);
  },
  //点击播放录音
  gotoPlay: function (e) {
    var filePath = e.currentTarget.dataset.key;
    //点击开始播放
    wx.showToast({
      title: '开始播放',
      icon: 'success',
      duration: 1000
    })
    wx.request({
      url: filePath,
      success(res) {
        console.log(res);
      }
    })
    wx.playVoice({
      filePath: filePath,
      success: function () {
        wx.showToast({
          title: '播放结束',
          icon: 'success',
          duration: 1000
        })
      }
    })
  }
})
//麦克风帧动画
function speaking() {
  var _this = this;
  //话筒帧动画
  var i = 1;
  this.timer = setInterval(function () {
    i++;
    i = i % 5;
    _this.setData({
      j: i
    })
  }, 200);
}