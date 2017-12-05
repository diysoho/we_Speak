var app = getApp();
var lastList = null;
var currentListGet = [];
var currentListSend = [];
var time = [];
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
    myInfo: {},
    getData:false,
    page:1,
    scroll_top:0
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中',
      mask:true
    })
   getData.call(this);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      scroll_top:0
    })
  },
  /**
   * 切换显示数据
   */
  current(e){
    wx.showLoading({
      title: '加载中',
    })
    if (e.currentTarget.dataset.current=="2"){
      currentListSend = [];
      this.setData({
        current:false,
        page:1,
        scroll_top:0
      })
    }else{
      currentListGet = [];
      this.setData({
        current: true,
        page:1,
        scroll_top: 0
      })
    }
    getData.call(this);
  },
  scroll(e){
    const that = this;
    time.push(e.timeStamp);
    wx.setStorageSync('timeStamp', e.timeStamp);
    if (lastList < 10) {
      wx.showToast({
        title: '到底了',
        duration: 2000
      })
    } else {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      setTimeout(()=>{
        if (time.pop() == wx.getStorageSync('timeStamp')){
          const page = that.data.page + 1;
          that.setData({
            page: page
          })
          time=[];
          getData.call(this);
        }
      },1000)
    }
  }
})

function getData(){
  const that = this;
  const page = this.data.page;
  if (this.data.current){
    wx.request({
      url: app.globalData.url+"/Bns/Auth/room_list",
      data: {
        openid: getApp().globalData.openid,
        pageid: page
      },
      success(res){
        currentListGet = currentListGet.concat(res.data.data.list);
          that.setData({
            data: {
              money: res.data.data.count_money,
              num: res.data.data.count_num,
              list: currentListGet
            },
            getData: true
          })
          wx.hideLoading();
          lastList = res.data.data.list.length;
      }
    })
  }else{
    wx.request({
      url: app.globalData.url + "/Bns/Auth/shoubao_list",
      data:{
        openid: getApp().globalData.openid,
        pageid: page
      },
      success(res){
        currentListSend = currentListSend.concat(res.data.data.list);
        that.setData({
          data: {
            money: res.data.data.count_money,
            num: res.data.data.count_num,
            list: currentListSend
          },
          getData: true
        })
        wx.hideLoading();
        lastList = res.data.data.list.length;
      }
    })
  }
}