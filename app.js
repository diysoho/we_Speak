App({
  globalData: {
    userInfo: null,
    url: "https://www.fansba.com.cn",
    appId: "wx6e7be3486f738b76",
    socket: "wss://www.fansba.com.cn",
    openid: "",
    room_id: '',
    money:0
  },
  onShow: function (options) {
    const that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          //发起网络请求
          wx.request({
            url: that.globalData.url + '/Bns/Auth/get_user_info?code=' + res.code,
            success: res => {
              console.log(res);
              that.globalData.openid = res.data.data.auth.openid;
              that.globalData.money = res.data.data.user.money;
              wx.setStorageSync('usermg', res.data.data.user);
            }
          })
        } else {
        }
      }
    });
    if (!wx.canIUse('getSetting.success')) {
      wx.showModal({
        title: '温馨提示',
        content: '请升级您的微信版本，然后使用',
        showCancel: false
      })
      return;
    }
  },
  getUserInfo: function (cb) {
    var that = this;
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo);
    } else {
      //调用登录接口
      wx.login({
        success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo;
              typeof cb == "function" && cb(that.globalData.userInfo);
            },
            fail(){
              wx.showModal({
                title:'温馨提示',
                content:"拒绝后，请将小程序删除，重新进入",
                showCancel:false
              })
            }
          })
        }
      });
    }
  },
  onError: function (msg) {
    console.log(msg);
  }
})