var tools = require("./../../utils/util.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    money_balance: 298.75, 
    button:"button_default",
    input:false,
    inputMoney:null,
    enough:'enough'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideLoading();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 输入金额
   */
  input(e){
    if (e.detail.value){
      this.setData({
        input: true,
        inputMoney:e.detail.value,
        enough:'enough'
      })
    }else{
      this.setData({
        input: false,
        inputMoney: e.detail.value
      })
    }
    
  },
  /**
   * 提现按钮
   */
  press_down(e){
    console.log(tools.getTime());
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    if (this.data.input){
      const money = this.data.money_balance;
      const inputMoney = this.data.inputMoney;
      if (money < inputMoney){
        this.setData({
          enough:'no_enough'
        })
      }else{
        wx.hideLoading();
        this.setData({
          button: "button_press_down"
        })
        wx.redirectTo({
          url:'/pages/moneySucc/moneySucc?money='+inputMoney+''
        })
      }
    }else{
      wx.hideLoading();
      wx.showModal({
        title: '温馨提示',
        content: '请输入金额',
        showCancel: false
      })
    }
  },
  /**
   * 全部提现
   */
  getAllMoney(){
    // 全部提现
  },
  pay(e) {
    var that = this;
    var input = that.data.message;
    if (input > 0) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      var timeStamp = time.timeStamp();//获取时间戳
      var randomString = time.randomString();//获取随机数
      var openid = app.globalData.openid;
      var appid = app.globalData.appId;
      var order_id = timeStamp + randomString;//订单号
      var money = that.data.message;//提现的金额
      var str = order_id + "-" + money + "-" + timeStamp + "-" + openid
      //用md5加密两次
      var sig = util.hexMD5(str);
      var strin = sig + appid;
      var sign = util.hexMD5(strin);
      wx.request({
        url: "https://www.fansba.com.cn/home/Cash/index?order_id=" + order_id + "&money=" + money + "&openid=" + openid + "&create_time=" + timeStamp + "&sign=" + sign,//提现请求地址
        data: {},
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          var code = res.data.code;
          if (code > 0) {
            console.log(res)
            wx.showModal({
              title: '温馨提示',
              content: res.data.message,
              showCancel: false
            });
          }
          if (code == 0) {
            wx.showModal({
              title: '温馨提示',
              content: res.data.message,
              showCancel: false
            })
            wx.reLaunch({
              url: "/pages/mine/mine",
              success: function () {
                console.log(1)
              },
              fail: function (res) {
                console.log(res)
              }
            })
          }
          that.setData({
            show: false,
            message: ""
          })
          wx.hideLoading();
        },
        fail: function (err) {
          wx.hideLoading();
        }
      })
    } else {
      wx.showToast({
        title: '请重新输入',
      })
    }
  },
})