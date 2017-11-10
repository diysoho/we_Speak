let tools = require("./../../utils/util.js");
let md5 = require("./../../utils/md5.js");
Page({
  /**
   * 页面的初始数据
   */
  data: {
    money: 0, 
    button:"button_default",
    input:false,
    inputMoney:null,
    enough:'enough',
    timeStemp:null,
    code:null,
    sucGetMoney:false,
    message:""
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    getMoney.call(this);
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
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that = this;
    if (this.data.input){
      const { money, inputMoney} = this.data;
      if (money < inputMoney){
        this.setData({
          enough:'no_enough'
        })
        wx.hideLoading();
      }else{
        that.getMoney();
        that.setData({
          button: "button_press_down"
        });
        setTimeout(()=>{
          if (that.data.sucGetMoney){
            if (that.data.code == 0) {
              wx.redirectTo({
                url: '/pages/moneySucc/moneySucc?money=' + inputMoney
              })
            } else {
              wx.showModal({
                title: '温馨提示',
                content: "提现失败",
                showCancel: false
              })
              that.setData({
                button: "button_default"
              })
            }
          }
        },2000);
      }
    }else{
      wx.hideLoading();
      wx.showModal({
        title: '温馨提示',
        content: this.data.messsage,
        showCancel: false
      })
    }
  },
  /**
   * 全部提现
   */
  getAllMoney(){
    // 全部提现
    const that = this;
    this.setData({
      inputMoney: this.data.money
    })
    this.getMoney();
    setTimeout(()=>{
      if (that.data.code != 0) {
        wx.showModal({
          title: '温馨提示',
          content: "提现失败",
          showCancel: false
        })
      } else {
        wx.redirectTo({
          url: '/pages/moneySucc/moneySucc?money=' + that.data.inputMoney
        })
      }
    },1000)
  },
  /**
   * 提现
   */
  getMoney(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    const openid = getApp().globalData.openid;
    const money = this.data.inputMoney;
    const order_id = this.data.timeStemp + (Math.random() * 9000 + 1000).toFixed(0);
    const create_time = this.data.timeStemp;
    const signOne = md5.hexMD5(order_id + "-" + money + "-" + create_time + "-" + openid);
    const appid = getApp().globalData.appId;
    const signTwo = md5.hexMD5(signOne + appid);
    const that = this;
    wx.request({
      url: getApp().globalData.url + "/Bns/Cash/index",
      data: {
        openid: openid,
        money: money,
        order_id, order_id,
        create_time: create_time,
        sign: signTwo
      },
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        that.setData({
          code: res.data.code,
          sucGetMoney:true,
          messsage: res.data.messsage
        })
        wx.hideLoading();
      },
      fail: res => {
        wx.hideLoading();
      }
    })
  }
})
/**
 * 请求money数据
 */
function getMoney(){
  const that = this;
  wx.request({
    url: getApp().globalData.url + "/Bns/auth/getMyAccountInfo",
    data: {
      openid: getApp().globalData.openid
    },
    header: {
      'content-type': 'application/json'
    },
    success: res => {
      that.setData({
        timeStemp: res.data.data.time,
        money: res.data.data.user.money
      });
      wx.hideLoading();
    }
  })
}