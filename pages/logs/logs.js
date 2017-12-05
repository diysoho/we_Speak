//logs.js
const app = getApp();
const time = require('../../utils/util.js');
const util = require('../../utils/md5.js');
var i=0;

Page({
  data: {
    j: 0,//帧动画初始图片
    s:0,
    isSpeaking: false,//是否正在说话
    message:'按住说出上方口令',
    headpic:"",
    kouling:'',
    lingqu:'',
    nick:'',
    optionId:'',
    creatid:'',
    total_money:"0",
    lingqu:"0",
    total_num:"0",
    list: '',
    lingwan:'0',
    background:"speak",
    zishi:false,
    canUse: wx.canIUse('button.open-type.share'),
    coverBoolen:'coverHide',
    coverContent:'',
    socketState:false
  },
  down:0,
  up:0,
  onLoad: function (option) {
    if (wx.getSetting){
      //语音接口授权
      wx.getSetting({
        success(res) {
          if (!res['scope.record']) {
            // 接口调用询问
            wx.authorize({
              scope: 'scope.record',
              success(res) {},
              fail() { },
              complete() { }
            })
          }
        }
      })
    }
    const that = this;
    const optionId = option.id
    const creatid=option.crearid
    that.setData({
      creatid: creatid
    })
    // 分享点击进入用户获取参数
    this.setData({
      optionId: option.id
    })
  },
 
  onReady(){
    const that = this;
    wx.connectSocket({
      url: app.globalData.socket + '/bns_wss',
      success: (res) => {
      },
      fail: (res) => {
      }
    })
    wx.onSocketOpen(function (res) {
      that.setData({
        socketState: true
      })
      var info = wx.getStorageSync('usermg');
      if (JSON.stringify(info) == "{}") {
        wx.showLoading({
          title: '加载中',
          mask: false
        })
        wx.login({
          success: function (res) {
            if (res.code) {
              wx.getUserInfo({
                success: function (res) {
                  var headpic = res.userInfo.avatarUrl;
                  var nick = res.userInfo.nickName;
                  wx.request({
                    url: app.globalData.url + '/Bns/Auth/set_user',
                    data: {
                      openid: app.globalData.openid,
                      nick: nick,
                      headpic: headpic
                    },
                    method: 'GET',
                    success: function (res) {
                      wx.hideLoading();
                      if (res.data.code > 0) {
                        // wx.showToast({
                        //   title: '有误',
                        // })
                      }
                    }
                  })
                }
              })
            }
          }
        })
      }
        wx.showLoading({
          title: '加载中',
          mask: false
        })
        //app.globalData.room_id = that.data.optionId;
        var room_idyh = that.data.optionId;
        var appid = app.globalData.appId;
        var creat = that.data.creatid;
        var openid = app.globalData.openid;
        var us = wx.getStorageSync("usermg");
        var id = us.id;
        var str = room_idyh + openid + id;
        var first = util.hexMD5(str);
        var second = first + appid;
        var sig = util.hexMD5(second);
        wx.request({
          url: app.globalData.url + '/Bns/Room/room_info',
          data: {
            room_id: room_idyh,
            create_user_openid: that.data.creatid,
            openid: app.globalData.openid
          },
          success: res => {
            if (that.data.socketState){
              sendSocketMessage('{ "type": "login", "room_id":"' + room_idyh + '","openid":"' + openid + '", "id":"' + id + '","sign":"' + sig + '"}');
            }else{
              that.onReady();
            }
            wx.setStorageSync("create_user_openid", res.data.data.room.create_user_openid);
            wx.setStorageSync("roomfx", res.data.data.room.id);
            wx.setStorageSync("userInfo", res.data.data.user);
            if (res.data.code == 0) {
              var headpic = res.data.data.user.headpic;
              var nick = res.data.data.user.nick;
              var total_money = res.data.data.room.red_money;
              var total_num = res.data.data.room.red_num;
              var kouling = res.data.data.room.kouling;
              that.setData({
                headpic: headpic,
                nick: nick,
                total_money: total_money,
                total_num: total_num,
                kouling: kouling
              })
              if (res.data.data.room.give_over == 1) {
                that.setData({
                  message: "已被领完",
                  lingwan: 1,
                  background: "done"
                })
              }
              if (res.data.data.shoubao_status == 1) {
                var zc_status = res.data.data.red_money;
                that.setData({
                  message: zc_status,
                  lingwan: 1,
                  background: "speakWrap"
                })
              }
            } else if (res.data.code != 0) {
            }
          }
        })
    });
    
    wx.onSocketMessage(function (res) {
      var data = JSON.parse(res.data);
      if (data.type != "ping") {
      }
      switch (data.type) {
        case "roomList":
          var list = data.list;
          var lingqu = list.length;
          var box = [];
          for (var i = 0; i < list.length; i++) {
            var lists = { nick: list[i].user.nick, headpic: list[i].user.headpic, audio_url: list[i].audio_url, red_money: list[i].red_money, create_time: list[i].create_time, srcurl: '/images/say2.png'}
            box.push(lists);
          }
          that.setData({
            list: box,
            lingqu: lingqu
          })
          wx.hideLoading();
          break;

        case 'logined':
          var client_id = data.client_id;
          wx.request({
            url: app.globalData.url + '/Bns/Room/getCurRoomList?client_id=' + client_id + '&room_id=' + that.data.optionId,
            success: function (res) {
            },
            fail: function (res) {
            }
          })
          wx.hideLoading();
          break;
      }
    })
  },
  //手指按下
  touchdown: function (e) {
    
    this.down = e.timeStamp;
    const that=this;
    if(that.data.lingwan==0){
      that.setData({
        isSpeaking: true,
        message: "按住松手录音完毕",
        background: "notspeak"
      })
      
      wx.request({
        url: app.globalData.url + '/Bns/room/getCurtime',
        data: {},
        success: function (res) {
          if ((that.up - that.down) < 200 && (that.up - that.down)>0) {
            that.setData({
              isSpeaking:false,
              background:"speak"
            })
            clearInterval(that.timer);
            wx.stopRecord();
            wx.hideLoading();
            return;
          }
          var create_time = res.data.data.time;
          if (that.data.isSpeaking) {
            speaking.call(that);
            wx.startRecord({
              success: function (res) {
                var tempFilePath = res.tempFilePath
                var name = tempFilePath.substring(9);
                var room_id = that.data.optionId;
                var openid = app.globalData.openid;
                var appId = app.globalData.appId;
                var str = openid + "-" + room_id + "-" + create_time + "-" + name;
                var sig = util.hexMD5(str);
                var strin = sig + appId;
                var sign = util.hexMD5(strin);
                wx.showLoading({
                  title: '加载中',
                  mask: true
                })
                wx.uploadFile({
                  url: app.globalData.url + '/Bns/Room/upload_audio', //仅为示例，非真实的接口地址
                  filePath: res.tempFilePath,
                  name: 'file',
                  formData: {
                    "room_id": room_id,
                    'create_time': create_time,
                    'openid': openid,
                    'sign': sign,
                    "name": name
                  },
                  success: function (res) {
                    console.log(res);
                    wx.hideLoading();
                    var datas = JSON.parse(res.data)
                    var code = datas.code;
                    if (code == 1) {
                      wx.showModal({
                        title: "领取失败",
                        content: "您的口令不对，请重新获取",
                        showCancel: false,
                        confirmText: "再来一次",
                        success: function (res) {
                          if (res.confirm) {
                            that.setData({
                              message: "按住说出上方口令"

                            })
                          } else if (res.cancel) {
                          }
                        }
                      })

                    } else if (code == 0) {
                      var price = datas.data.price;
                      that.setData({
                        lingwan: 1,
                        message: price,
                        background: "speakWrap",
                        coverBoolen:'coverShow',
                        coverContent: price
                      })
                    }else if(code ==102){
                      wx.showModal({
                        title:"温馨提示",
                        content: datas.message,
                        showCancel: false,
                      })
                      that.setData({
                        background:"done",
                        message:"已被领完",
                        lingwan: 1,
                      })
                    }else{
                      wx.showModal({
                        title:"温馨提示",
                        content:"房间异常",
                        showCancel: false,
                      })
                      that.setData({
                        background: "done",
                        message: "房间异常",
                        lingwan: 1,
                      })
                    }
                  }
                })
              },
              fail: function (res) {
                //录音失败
                that.setData({
                  isSpeaking: false,
                  zishi: true
                })
                wx.showModal({
                  title: '提示',
                  content: '录音的姿势不对!',
                  showCancel: false,
                  success: function (res) {
                    if (res.confirm) {
                      return;
                    }
                  }
                })
              }
            })
          }
        }
      })
    }
  },
  //手指抬起
  touchup: function (e) {
    this.up = e.timeStamp;
    if (this.data.lingwan == 0){
      if ((this.up - this.down) < 200 && (this.up - this.down) > 0) {
        wx.showModal({
          title: '温馨提示',
          content: '录音时间太短，请重新输入',
          showCancel: false,
        })
        clearInterval(this.timer);
        wx.stopRecord();
        return;
      }
    }
    if (this.data.lingwan == 0){
      this.setData({
        isSpeaking: false,
        background: "speak"
      })
      clearInterval(this.timer);
      wx.stopRecord();
      if (this.data.zishi == true) {
        wx.hideLoading();
      }
    }
  },
  //点击播放录音
  idnexP:null,
  play:false,
  gotoPlay: function (e) {
    clearInterval(this.timer);
    wx.stopVoice();
    var that=this;
    var aa = that.data.list;
    for (var i = 0; i < aa.length; i++) {
      aa[i].srcurl = '/images/say2.png';
    }
    that.setData({
      list: aa
    }) 
    if (this.idnexP == e.currentTarget.dataset.index && this.play) {
      clearInterval(that.timer);
      wx.stopVoice();
      aa[this.idnexP].srcurl = '/images/say2.png';
      that.setData({
        list: aa
      })
      this.play = false;
    }else{
      this.idnexP = e.currentTarget.dataset.index;
      var filePath = e.currentTarget.dataset.key; //播放文件路径
      that.speak(this.idnexP);
      wx.downloadFile({
        url: getApp().globalData.url + '/Bns'+filePath, //服务器文件
        success: function (res) {
          wx.playVoice({
            filePath: res.tempFilePath,
            complete: function () {
              wx.stopVoice();
              clearInterval(that.timer);
              that.setData({
              list:aa
              });
            }
          })
        }
      })
      this.play = true;
    }
    if (this.idnexP == null && !this.play) {
      this.play = true;
      this.idnexP = e.currentTarget.dataset.index;
      var filePath = e.currentTarget.dataset.key; //播放文件路径
      that.speak(this.idnexP);
      wx.downloadFile({
        url: getApp().globalData.url+'/Bns' + filePath, //服务器文件
        success: function (res) {
          wx.playVoice({
            filePath: res.tempFilePath,
            complete: function () {
              wx.stopVoice();
              clearInterval(that.timer);
              that.setData({
                list: aa
              });
            }
          })
        }
      })
    } 
  },
  // 当返回上一页的时候，关闭掉socket
  onUnload() {  // wx.navigateBack() 和 wx.redirectTo({}) 的时候使
    wx.closeSocket({
      success: function () {
      }
    })
  },
  onPullDownRefresh(res) {
    const that = this;
    if (wx.startPullDownRefresh){
      wx.startPullDownRefresh({
        success: res => {
          wx.closeSocket({
            success: function () {
              console.log("关闭了");
              that.onReady();
            }
          })
        },
        complete: res => {
          console.log("刷新完成");
          wx.stopPullDownRefresh();
        }
      })
    }else{
      wx.showModal({
        title: '温馨提示',
        content: '您微信版本较低，请您升级版本，使用更流畅哦'
      })
    }
  },
  //播放语音动画
  speak: function (e) {
    var _this = this;
    //话筒帧动画
    var aa = _this.data.list;
    this.timer = setInterval(function () {
      i++;
      i = i % 3;
      aa[e].srcurl = '/images/say' + i + '.png';
      _this.setData({
        list: aa
      })
    }, 200);
  },
  toShare(){
    const roomid = wx.getStorageSync("roomfx");
    const openid = wx.getStorageSync("create_user_openid");
    const userInfo = wx.getStorageSync("userInfo");
    wx.redirectTo({
      url: './../myindex/myindex?roomid=' + roomid + '&openid=' + openid + '&userInfo=' + userInfo,
    })
  },
  toHome(){
    wx.redirectTo({
      url: './../index/index',
    })
  },
  toMoney() {
    wx.navigateTo({
      url: './../money/money',
    })
  },
  toReport(){
    wx.navigateTo({
      url: './../report/report',
    })
  },
  tishi: function () {
    wx.showModal({
      title: '温馨提示',
      content: '请升级微信版本或点击右上角转发',
      showCancel: false,
    })
  },
  toRecord(){
    wx.navigateTo({
      url: './../record/record',
    })
  },
  closeCover(){
    this.setData({
      coverBoolen:'coverHide'
    })
  }
})

//麦克风帧动画
function speaking() {
  var _this = this;
  //话筒帧动画
  var i = 0;
  this.timer = setInterval(function () {
    i++;
    i = i % 4;
    _this.setData({
      j: i
    })
  }, 350);
}
//  发送请求到服务器
function sendSocketMessage(msg) {
  wx.sendSocketMessage({
    data: msg
  })
}
