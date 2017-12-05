Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0
  },
  click(e){
    if (this.data.id == e.currentTarget.dataset.id){
      this.setData({
        id: 0
      })
    }else{
      this.setData({
        id: e.currentTarget.dataset.id
      })
    }
  }
})