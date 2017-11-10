
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
    yue:null
  },

  //事件处理函数
  onLoad: function () {
    console.log(getApp().globalData.money);
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
      yue: getApp().globalData.money
    })
  },
  onHide(){
    this.setData({
      num: '',
      moneyNum: '',
      val: ''
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
      var moneyNum = parseFloat(e.detail.value);
        that.setData({
          moneyNum: moneyNum
        });
      }
   
    },
 //数量
  bindNumber:function(e){
    var that=this;
    var num=e.detail.value;
    var reg = /^([1-9]\d{0,1}|100)$/;
    if(reg.test(num)){
      that.setData({
        num:num
      })
    }else{
      wx.showToast({
        title: '您输入有误',
      }),
      that.setData({
        num:''
      })
    }
  },

//宣传语
  bindBroad:function(e){
    var that=this;
    var broadcast=e.detail.value;
    that.setData({
      broadcast: broadcast
    })
  },
  // 选择支付方式
  choosePayMoney:function(e) {
    var that=this;
    if (e.currentTarget.dataset.id == "yuer") {
      that.setData({
        choosePay: "yuer"
      })
    } else {
      that.setData({
        choosePay: "weixin"
      })
    }
  },
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
  formSubmit:function(e){
    var that = this;
    if (e.detail.value.num.length != 0 && e.detail.value.kouling.length != 0 && e.detail.value.money.length != 0){
      wx.showLoading({
        title: '加载中',
        mask: true
      })
    var usermsg = wx.getStorageSync('usermg');
    var us = that.data.userInfo;
    if (JSON.stringify(us) != "{}"){
      var nick = us.nickName;
      var headpic = us.avatarUrl;
      that.setData({
        nick: nick,
        headpic: headpic
      })
      
      wx.request({
        url: getApp().globalData.url + '/Bns/Room/create_room',
        data:{
          create_user_openid: getApp().globalData.openid,
          kouling: that.data.val,
          red_num: that.data.num,
          pay_money: that.data.pay_money,
          red_money:that.data.moneyNum,
          xuanchuanyu: that.data.broadcast,
          pay_type:that.data.choosePay
        },
        method: 'GET',
        success:function(res){
          wx.hideLoading();
          console.log(res);
            getApp().globalData.room_id = res.data.data.room_id;
            //如果是余额支付
            if (that.data.choosePay == "yuer") {
              var code = res.data.code;
              if (code == 0) {
                wx.showToast({
                  title: "支付成功",
                })
                wx.navigateTo({
                  url: '/pages/myindex/myindex'
                })
              } else if (code > 0) {
                wx.showModal({
                  title: '温馨提示',
                  content: res.data.message,
                  showCancel: false
                })
                that.setData({
                  num: '',
                  moneyNum: '',
                  val: ''
                })
              }
            }
            // 如果是微信支付
            if (that.data.choosePay == "weixin") {
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
                  wx.navigateTo({
                    url: '../myindex/myindex'
                  })
                },
                fail: function (data) {
                  wx.showModal({
                    title: '温馨提示',
                    content: '支付失败',
                    showCancel: false
                  })
                  that.setData({
                    num: '',
                    moneyNum: '',
                    val: ''
                  })
                }
              })
            }
        }
      })
    }else{
      wx.showModal({
        title: '温馨提示',
        content: '请先授权登录',
        showCancel: false
      })
    }
  }else{
      wx.showToast({
        title: '输入信息有误',
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
})
