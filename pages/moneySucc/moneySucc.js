
Page({
  /**
   * 页面的初始数据
   */
  data: {
    money:'-',
    button: "button_default"
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      money: options.money
    })
  },
  success(){
    this.setData({
      button: "button_press_down"
    })
    wx.reLaunch({
      url:"/pages/money/money"
    })
  },
  toHome(){
    wx.reLaunch({
      url: "/pages/index/index"
    })
  }
})