
Page({

  /**
   * 页面的初始数据
   */
  data: {
    money:null,
    button: "button_default",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    this.setData({
      money: options.money
    })
  },
  /**
   * 初次渲染完成
   */
  onReady(){
    wx.hideLoading();
  },
  success(){
    this.setData({
      button: "button_press_down"
    })
    wx.reLaunch({
      url:"/pages/money/money"
    })
  }
})