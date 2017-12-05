let util = require('./../../utils/util.js');
let md5 = require("./../../utils/md5.js");
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    head: './../../images/head.png',
    choosePay: "weixin",
    color:"yuanlai",
    nick:'',
    headpic:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    val:'',
    pay_money: "",
    fw: '0.00',
    num:'',
    moneyNum:'',
    yue:'-',
    showRule:false
  },

  //事件处理函数
  onLoad: function () {
    var that = this
    //调用应用实例的方法获取全局数据
    getApp().getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo,
        hasUserInfo:true
      })
    })
  },
  onShow(){
    this.setData({
      val: '',
      fw: '0.00',
      pay_money: "",
      num: '',
      moneyNum: '',
      choosePay: "weixin"
    })
  },
  onReady(){
    const that = this;
    getApp().onShow((money)=>{
      that.setData({
        yue: money
      })
    })
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
  },

  //口令
  bindChange: function (e) {
    var that = this;
    var val = e.detail.value;
    var aa = val.replace(/[^\u4E00-\u9FA5]/g, '');
    var ff = aa.substring(0, 50); //截取字符串
    that.setData({
      val: ff
    })
  },
  //奖励
  bindMoney:function(e){
    var that=this;
    if (e.detail.value == "") {
      this.setData({
        fw: "0.00"
      });
    } else {
      var a = e.detail.value * 1;
      var b = e.detail.value * 0.02;
      a = a + b;
      a = a.toFixed(2);
      b = b.toFixed(2);
      that.setData({
        pay_money: a,
        fw: b
      });
      const moneyNum = util.clear(e.detail.value);
      that.setData({
        moneyNum: moneyNum
      });
    }
  },
 //数量
  bindNumber:function(e){
    if (e.detail.value > 100){
      wx.showModal({
        title: '温馨提示',
        content: '打赏数量最多设置100个',
        showCancel:false
      })
      this.setData({
        num: ''
      })
      return;
    }else{
      this.setData({
        num: e.detail.value
      })
    }
  },

  // // 选择支付方式
  // choosePayMoney:function(e) {
  //   var that=this;
  //   if (e.currentTarget.dataset.id == "yuer") {
  //     that.setData({
  //       choosePay: "yuer"
  //     })
  //   } else {
  //     that.setData({
  //       choosePay: "weixin"
  //     })
  //   }
  // },
  current: function (e) {
    var that = this;
    that.setData({
      color: "anxia"
    })
  },
  changecolor: function (e) {
    var that = this;
    that.setData({
      color: "yuanlai"
    })
  },
  formSubmit: function (e) {
    const that = this;
    if (e.detail.value.num.length != 0 && e.detail.value.kouling.length != 0 && e.detail.value.money.length != 0 && that.data.userInfo.avatarUrl != undefined) {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      wx.request({
        url: getApp().globalData.url + "/Bns/auth/getMyAccountInfo",
        data: {
          openid: getApp().globalData.openid
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          const openid = getApp().globalData.openid;
          const money = that.data.pay_money;
          const create_time = res.data.data.time;
          const signOne = md5.hexMD5(money + "-" + create_time + "-" + openid);
          const appid = getApp().globalData.appId;
          const signTwo = md5.hexMD5(signOne + appid);
          wx.request({
            url: getApp().globalData.url + '/Bns/Room/create_room',
            data: {
              create_user_openid: getApp().globalData.openid,
              kouling: that.data.val,
              red_num: that.data.num,
              pay_money: that.data.pay_money,
              red_money: that.data.moneyNum,
              sign: signTwo,
              create_time: create_time
            },
            method: 'GET',
            success: function (res) {
              console.log(res);
              if(res.data.code ==2){
                wx.showModal({
                  title: '温馨提示',
                  content: res.data.message,
                  showCancel: false
                })
                that.setData({
                  val:''
                })
                wx.hideLoading();
                return ;
              }
              wx.hideLoading();
              getApp().globalData.room_id = res.data.data.room_id;
              //如果是余额支付
              if (res.data.data.pay_type == "yuer") {
                const code = res.data.code;
                if (code == 0) {
                  wx.showToast({
                    title: "支付成功",
                    success: res => {
                      wx.redirectTo({
                        url: '/pages/myindex/myindex'
                      })
                    }
                  })
                } else if (code == 12) {
                  wx.showModal({
                    title: '温馨提示',
                    content: '账户余额不足',
                    showCancel: false
                  })
                  that.setData({
                    choosePay: "weixin"
                  })
                } else {
                  wx.showModal({
                    title: '温馨提示',
                    content: res.data.message,
                    showCancel: false
                  })
                }
              }
              // 如果是微信支付
              if (res.data.data.pay_type == "weixin") {
                const code = res.data.code;
                if (code == 0) {
                  wx.requestPayment({
                    timeStamp: res.data.data.pay_result.create_time,
                    nonceStr: res.data.data.pay_result.nonce_str,
                    package: 'prepay_id=' + res.data.data.pay_result.prepay_id,
                    'signType': 'MD5',
                    paySign: res.data.data.pay_result.paySign,
                    success: function (data) {
                      wx.showToast({
                        title: "支付成功",
                      })
                      wx.redirectTo({
                        url: '../myindex/myindex'
                      })
                    },
                    fail: function (data) {
                      wx.showModal({
                        title: '温馨提示',
                        content: '支付失败',
                        showCancel: false
                      })
                    }
                  })
                } else if (code == 12) {
                  wx.showModal({
                    title: '温馨提示',
                    content: '账户余额不足',
                    showCancel: false
                  })
                  that.setData({
                    choosePay: "weixin"
                  })
                } else {
                  wx.showModal({
                    title: '温馨提示',
                    content: res.data.message,
                    showCancel: false
                  })
                }
              }
            }
          })
        }
      })

      // }
    } else if (that.data.userInfo == {}) {
      wx.showToast({
        title: '请获取信息后使用'
      })
    } else {
      wx.showToast({
        title: '输入信息有误'
      })
    }
  },
  toRecord(){
    wx.navigateTo({
      url: './../record/record',
    })
  },
  toMoney() {
    wx.navigateTo({
      url: './../money/money',
    })
  },
  toProblem(){
    wx.navigateTo({
      url: './../problem/problem',
    })
  },
  toReport() {
    wx.navigateTo({
      url: './../report/report',
    })
  },
  showDescription(){
    wx.showModal({
      title: "服务条款说明",
      content: "本小程序收取2%服务费用，使用本小程序则表示您默认同意本服务条款。",
      showCancel: false,
    })
  },
  onShareAppMessage(){
    return {
      title: '有本事别点开',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  rule(){
    this.setData({
      showRule: !this.data.showRule
    })
  }
})
