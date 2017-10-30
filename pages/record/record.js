var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data:{
      money:0,
      num:0,
      list:[]
    },
    current:true,
    myInfo: null,
    getData:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (app.globalData.userInfo){
      this.setData({
        myInfo: app.globalData.userInfo
      })
    }else{
      wx.getUserInfo({
        success:res=>{
          that.setData({
            myInfo: res.userInfo
          })
        }
      })
    }
  },  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中',
      mask:true
    })
   console.log(this.data.myInfo);
   getData.call(this);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  /**
   * 切换显示数据
   */
  current(e){
    wx.showLoading({
      title: '加载中',
    })
    if (e.currentTarget.dataset.current=="2"){
      this.setData({
        current:false
      })
    }else{
      this.setData({
        current: true
      })
    }
    getData.call(this);
  }
})

function getData(){
  const that = this;
  if (this.data.current){
    wx.request({
      url: app.globalData.url+"/Bns/Auth/room_list",
      data: {
        openid: 12345
      },
      success(res){
        that.setData({
          data:{
            money: res.data.data.count_money,
            num: res.data.data.count_num,
            list: res.data.data.list
          },
          getData: true
        })
        wx.hideLoading();
      }
    })
  }else{
    wx.request({
      url: app.globalData.url + "/Bns/Auth/shoubao_list",
      data:{
        openid:12345
      },
      success(res){
        that.setData({
          data: {
            money: res.data.data.count_money,
            num: res.data.data.count_num,
            list: res.data.data.list
          },
          getData: true
        })
        wx.hideLoading();
      }
    })
  }
  
}