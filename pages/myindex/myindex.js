var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    roomid:'',
    bns:'Bns',
    up:'Uploads',
    url: "https://www.fansba.com.cn",
    create_user_openid:'',
    color:'two',
    canUse: wx.canIUse('button.open-type.share'),
    tx:'',
    name:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  current: function (e) {
    var that = this;
    that.setData({
      color: "anxia"
    })
  },
  changecolor: function (e) {
    var that = this;
    that.setData({
      color: "two"
    })

  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if (options.roomid){
      this.setData({
        roomid: options.roomid,
        create_user_openid: options.openid,
      })
    }else{
      var roomid = app.globalData.room_id;
      var creat_openid = app.globalData.openid;
      this.setData({
        roomid: roomid,
        create_user_openid: creat_openid,
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    const that = this;
    wx.request({
      url: that.data.url +'/Bns/Room/room_info_share',
      data:{
        room_id: that.data.roomid,
        create_user_openid: that.data.create_user_openid
      },
      success:res=>{
        console.log(res);
        that.setData({
          tx: res.data.data.user.headpic,
          name: res.data.data.user.nick
        });
        wx.hideLoading();
      }
    })
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    const that=this;
    if (that.data.canUse) {
      if (res.from === 'button') {
        // 来自页面内转发按钮
      }
    }
    return {
      title: that.data.name+"发了一个红包",
      path: '/pages/logs/logs?id=' + that.data.roomid + '&crearid='+that.data.create_user_openid,
      success: function (res) {
        // 转发成功
        wx.redirectTo({
          url: '/pages/logs/logs?id=' + that.data.roomid + '&crearid=' + that.data.create_user_openid
        }); 
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },

  tishi: function () {
    wx.showModal({
      title: '温馨提示',
      content: '请升级微信版本，或点击右上角转发',
      showCancel: false,
    })
  },
  friends_share:function(e){
    wx.showModal({
      title: '温馨提示',
      content: '点击小程序二维码保存到相册分享到朋友圈',
      success: function (res) {
        if (res.confirm) {
        } else if (res.cancel) {
        }
      }
    });
  },

 
  tishi:function(e){
      wx.showModal({
        title: '温馨提示',
        content:'由于您版本较低，请点击右上角分享',
        showCancel: false
      })
  },
  //保存二维码图片 分享到朋友圈
  save:function(e){
    var  that = this;
    var  pic=e.currentTarget.dataset.key;
    var shijian = e.timeStamp
    //触摸时间距离页面打开的毫秒数  
    // var touchTime = that.data.touch_end - that.data.touch_start;
    if(shijian>350){
      wx.getImageInfo({
        src: pic,
        success: function (res) {
          var path = res.path;
          wx.saveImageToPhotosAlbum({
            filePath: path,
            success(res) {
              wx.showToast({
                title: '保存成功',
                icon: 'success',
                duration: 2000
              })
            },
            fail: function (res) {
              wx.showToast({
                title: '保存失败',
                icon: 'success',
                duration: 2000
              })
            }
          })
        }
      })

    }
  }
})