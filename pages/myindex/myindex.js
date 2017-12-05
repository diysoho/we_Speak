var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    roomid:'',
    bns:'Bns',
    up:'Uploads',
    create_user_openid:'',
    color:'two',
    canUse: wx.canIUse('button.open-type.share'),
    tx:'',
    name:'',
    url:''
  },

  onLoad: function (options) {
    this.setData({
      url:getApp().globalData.url
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
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const that = this;
    wx.request({
      url: getApp().globalData.url +'/Bns/Room/room_info_share',
      data:{
        room_id: that.data.roomid,
        create_user_openid: that.data.create_user_openid
      },
      success:res=>{
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
      title: that.data.name+"发了一个语音口令",
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
  friends_share(e){
    console.log(this.data.roomid);
      const that = this;
      console.log(wx.getStorageSync('image'));
      if (wx.getStorageSync('image').roomid!=this.data.roomid) {
        console.log(1);
        wx.showLoading({
          title: '生成分享图',
        })
        wx.request({
          url: getApp().globalData.url + '/Bns/room/share_image',
          data: {
            room_id: that.data.roomid,
            is_check:1
          },
          success: res => {
            wx.setStorageSync('image', { url: getApp().globalData.url + '/Bns/room/share_image/room_id/' + that.data.roomid, roomid: that.data.roomid});
              if (res.data.code == 0) {
                wx.hideLoading();
                wx.previewImage({
                  current: getApp().globalData.url + '/Bns/room/share_image/room_id/' + that.data.roomid, // 当前显示图片的http链接
                  urls: [getApp().globalData.url + '/Bns/room/share_image/room_id/' + that.data.roomid] // 需要预览的图片http链接列表
                })
              } else {
                wx.showModal({
                  title: '温馨提示',
                  content: '生成图片失败，请重新点击',
                })
              }
            
          }
        })
      } else {
        wx.previewImage({
          current: wx.getStorageSync('image').url, 
          urls: [wx.getStorageSync('image').url] 
        })
      }
  },

  tishi:function(e){
      wx.showModal({
        title: '温馨提示',
        content:'由于您版本较低，请点击右上角分享',
        showCancel: false
      })
  }
})