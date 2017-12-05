var app=getApp();
var box = [];
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: [{ name: '欺诈骗钱', value: '欺诈骗钱', checked:true}, { name: '语言攻击', value: '语言攻击'}, { name: '色情低俗', value: '色情低俗' }, { name: '政治敏感', value: '政治敏感' }, { name: '诱导分享', value: '诱导分享' }, { name: '恶意营销', value: '恶意营销'}],
    val: '',
    zhi:''
  }, 


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var arr = that.data.array;
    var check=arr[0].name;
    that.setData({
      val: check
    }) 
  },
   
  checkboxChange:function(e){
    var that=this;
    var arr = e.detail.value;
    var aa=arr.join(',');
    that.setData({
      val:aa
    }) 
  },
  inp:function(e){
    var that=this;
    var val=e.detail.value;
    var final = val.substring(0, 100);
      that.setData({
        zhi: final
      })
  },
  formSubmit: function (e) {
    var that=this;
    if (that.data.val!=''||that.data.zhi!='') {
      if(that.data.val==''){
        var content = that.data.zhi
      }else{
        var content = that.data.val + ',' + that.data.zhi;
      }
      // console.log(content)
      wx.request({
        url: app.globalData.url + '/Bns/Jubao/index/openid/' + app.globalData.openid + '/content/' + content,
        method: 'GET',
        success: function (res) {
          if(res.data.code==0){
            wx.showModal({
              title: '温馨提示',
              content: res.data.message,
              showCancel: false,
              success: function (res) {
                wx.navigateBack({
                  delta:1
                })
              }
            })
          }else{
           wx.showModal({
             title: '提示',
             content: res.data.message,
             showCancel: false,
             success: function (res) {
               if (res.confirm) {
               } else if (res.cancel) {
                 console.log('用户点击取消')
               }
             }
           })
          }
        },
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '请选择投诉原因',
        showCancel:false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  }

})