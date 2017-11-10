import utils from '../utils/util.js';
import Promise from '../utils/es6-promise.min';
import request from './request.js';
import config from '../utils/const';


const endPoint = config.debug ? config.devEndPoint : config.proEndPoint;

// function get(url, data, successFn, errorFn, completeFn) {
//   var header = { 'content-type': 'application/json'};
//   request(url, header, "GET", data, successFn, errorFn, completeFn);
// }


// function post(url, data, successFn, errorFn, completeFn) {
//   var header = { 'content-type': 'application/json'};
//   request(url, header, "POST", data, successFn, errorFn, completeFn);
// }

// function request(url, header, method, data, successFn, errorFn, completeFn) {
//   wx.request({
//     url: url,
//     header: header,
//     method: method,
//     data: data,
//     success: function (res) {
//       utils.isFunction(successFn) && successFn(res.data);
//     },
//     fail: function (res) {
//       utils.isFunction(errorFn) && errorFn(res);
//     },
//     complete: function () {
//       utils.isFunction(completeFn) && completeFn();
//     }
//   });
// }


function get(url, data) {
  console.log('wtfffffffffffffffff', getApp());
  const options = {
    // 'content-type': 'application/json',
    headers: {
      "x-comp-token": getApp().globalData.token || '',
      "accesstoken": getApp().globalData.accessToken || '',
      "x-city-code": getApp().globalData.city ? getApp().globalData.city.code : '',
    },
    method: 'GET',
    // qs: Object.assign({sleep: 1}, data),
    qs: data,
  };
  getApp().log('request get ---- ' + url);
  return request(url, options);
}


function post(url, data) {
  const options = {
    headers: {
      "x-comp-token": getApp().globalData.token || '',
      "accesstoken": getApp().globalData.accessToken || '',
      "x-city-code": getApp().globalData.city ? getApp().globalData.city.code : '',
    },
    'content-type': 'application/json',
    method: 'POST',
    // qs: Object.assign({ sleep: 1 }, data),
    body: data,
  };
  getApp().log('request post ---- ' + url);
  return request(url, options);
}

/* ------------------首页接口-----------------------------*/
//小程序首页设置
function init(data) {
  return get(`${endPoint}/index/all`, data);
}

//获取菜单配置
function getIndexMenu(data) {
  return get(`${endPoint}/index/menu`, data);
}

//首页品牌列表
function getBrandList(data) {
  return get(`${endPoint}/index/brand/list`, data);
}

//首页门店列表
function getStoreList(data) {
  return get(`${endPoint}/index/store/list`, data);
}

//首页商品列表
function getGoodsList(data) {
  return get(`${endPoint}/index/goods/list`, data);
}

//首页搜索
function indexSearch(data) {
  return get(`${endPoint}/index/search`, data);
}

//搜索关键词保存
function saveIndexKeword(data) {
  return post(`${endPoint}/index/kw/save`, data);
}

//搜索页关键词列表
function getIndexKeWordList(data) {
  return get(`${endPoint}/index/kw/list`, data);
}

//搜索页关键词清空，或者删除某个关键词
function removeIndexKeWord(data) {
  return post(`${endPoint}/index/kw/remove`, data);
}

//首页--城市信息
function getIndexCities(data) {
  return get(`${endPoint}/index/cities`, data);
}

//首页--城市信息搜索
function searchIndexCity(data) {
  return get(`${endPoint}/index/city/search`, data);
}

//	首页--城市信息定位
function selectIndexCity(data) {
  return post(`${endPoint}/index/city/select`, data);
}

//	首页--选择带经纬度的地址作为当前位置
function locationIndexCity(data) {
  return post(`${endPoint}/index/city/location`, data);
}
// 根据id获取页面信息 	xcx/colorDetail
function getPageById(data) {
  return get(`${endPoint}/index/page`, data);
}
// 获取全局配色
function queryColor(data) {
  return get(`${endPoint}/xcx/colorDetail`, data);
}
//获取自定义页面
function queryCustom(data) {
  return get(`${endPoint}/index/custom`, data);
}
/*--------------------------品牌--门店--商品接口----------------------*/

//用户定位下的品牌列表
function getBrandListByLocation(data) {
  return get(`${endPoint}/brand/list`, data);
}

//品牌下的门店列表
function getStoreListByLocation(data) {
  return get(`${endPoint}/store/list`, data);
}

//获取门店类型
function getStoreType(data) {
  return get(`${endPoint}/store/loadStoreType`, data);
}

//门店介绍
function getStoreDetail(data) {
  return get(`${endPoint}/store/detail`, data);
}

//门店和门店下的下分类列表
function getStorecategoryList(data) {
  return get(`${endPoint}/storeGoods/categoryList`, data);
}

//门店下搜索商品
function getStoreGoodsList(data) {
  return get(`${endPoint}/storeGoods/list`, data);
}

//门店下搜索商品
function getStoreGoodsListByCategory(data) {
  return get(`${endPoint}/storeGoods/category/goodsList`, data);
}

//商品详情
function getStoreGoodDetail(data) {
  return get(`${endPoint}/storeGoods/detail`, data);
}

//检验商品库存
function getGoodStock(data) {
  return get(`${endPoint}/storeGoods/stock`, data);
}

/* -------------订单---------------------*/

// 单商品快速购买预校验
function checkoutSingleOrder(data) {
  return get(`${endPoint}/order/toOrder`, data);
}
// 单商品立即购买创建订单
function createSingleOrder(data) {
  return post(`${endPoint}/order/createOrder`, data);
}

//订单列表
function queryOrders(data) {
  return get(`${endPoint}/order/list`, data);
}

//订单详情
function showOrder(data) {
  return get(`${endPoint}/order/detail`, data);
}

//取消订单
function cancelOrder(data) {
  return post(`${endPoint}/order/cancel`, data);
}


//跟踪物流信息
function getLogistics(data) {
  return get(`${endPoint}/order/log`, data);
}



/* -----------支付--------------------*/
//获取微信支付签名
function queryPaySign(data) {
  return post(`${endPoint}/pay/wx/toPay`, data);
}


/*--------------收货地址-------------------*/

//订单结算时点击的选择地址
function getOrderConsignee(data) {
  return get(`${endPoint}/order/consignee/list`, data);
}


//获取用户收货地址
function queryAddressList(data) {
  return get(`${endPoint}/consignee/list`, data);
}

//添加用户收货地址
function createAddress(data) {
  return post(`${endPoint}/consignee/save`, data);
}

//更新用户收货地址
function updataAddress(data) {
  return post(`${endPoint}/consignee/modify`, data);
}

//获取用户收货地址
function queryAddressDetail(data) {
  return get(`${endPoint}/consignee/detail`, data);
}

//验证收货地址是否超区
function checkAddress(data) {
  return post(`${endPoint}/consignee/check`, data);
}


/*------------用户留言-------------*/

function saveMessage(data) {
  return post(`${endPoint}/message/save`, data);
}

/*----------用户登录注册--------------*/


//获取手机号校验码/改绑定获取手机号校验码
function getVerifyCode(data) {
  return post(`${endPoint}/jmall/bind/verifyCode`, data);
}

//	登录
function login(data) {
  return post(`${endPoint}/user/login`, data);
}


//保存用户信息
function saveUserInfo(data) {
  return post(`${endPoint}/user/save`, data);
}

//修改用户信息
function modifyUserInfo(data) {
  return post(`${endPoint}/user/modify`, data);
}


//修改用户信息
function initUser(data) {
  return post(`${endPoint}/user/init`, data);
}


// 	查询用户位置信息
function getUserLocation(data) {
  return get(`${endPoint}/user/findLocation`, data);
}

// 	查询用户信息
function queryUserInfo(data) {
  return get(`${endPoint}/user/lookup`, data);
}

// 	退出登录
function logout(data) {
  return post(`${endPoint}/user/logout`, data);
}


function updateWXUserInfo(data) {
  return post(`${endPoint}/user/updateUserInfo`, data);
}

/*----------------地图接口-----------------*/

function queryMap(data) {
  return get(`${endPoint}/map/suggestion`, data);
}

/*-----------------预约接口-----------------*/
// 	获取当前店铺类型
function queryStoreType(data) {
  return get(`${endPoint}/store/loadStoreType`, data);
}
// 店铺商品信息列表
function queryStoreGoodsList(data) {
  return get(`${endPoint}/storeGoods/goodsList`, data);
}
// 店铺服务项目列表
function queryProjectList(data) {
  return get(`${endPoint}/project/list`, data);
}
// 店铺服务项目详情
function queryProjectDetail(data) {
  return get(`${endPoint}/project/detail`, data);
}
// 店铺服务人员列表
function queryStaffList(data) {
  return get(`${endPoint}/staff/list`, data);
}
// 店铺服务人员详情
function queryStaffDetail(data) {
  return get(`${endPoint}/staff/detail`, data);
}
// 跳转至预约服务页面(配置信息)
function queryBookSetting(data) {
  return get(`${endPoint}/booking/toBook`, data);
}
// 预定时可选择的时间结果集
function queryLoadTime(data) {
  return get(`${endPoint}/booking/loadTime`, data);
}
// 从预定页面选择----店铺服务项目列表
function querySelectProjectList(data) {
  return get(`${endPoint}/project/projectList`, data);
}
// 从预定页面选择----店铺服务人员列表
function querySelectStaffList(data) {
  return get(`${endPoint}/staff/staffList`, data);
}
// 预定服务项目
function commitBookOrder(data) {
  return post(`${endPoint}/booking/book`, data);
}
// 用户预约列表
function queryBookList(data) {
  return get(`${endPoint}/booking/list`, data);
}
// 用户预约详细
function queryBookDetail(data) {
  return get(`${endPoint}/booking/detail`, data);
}
// 取消订单
function cancelBook(data) {
  return post(`${endPoint}/booking/cancel`, data);
}
// 店铺相册集
function queryAlbumsList(data) {
  return get(`${endPoint}/albums/list`, data);
}
// 选完人员，时间后，修改到店人数范围
function bookingCheck(data) {
  return get(`${endPoint}/booking/check`, data);
}
/*------------------优惠券----------------------*/
//领取优惠券
function receiveCoupon(data){
  return post(`${endPoint}/customerCoupon/receive`, data);
}

//我的优惠券列表
function queryCouponList(data) {
  return get(`${endPoint}/customerCoupon/list`, data);
}

// 优惠券详情
function queryCouponDetail(data){
  return get(`${endPoint}/customerCoupon/detail`, data);
}

// 下单优惠券列表
function queryOrderCouponList(data) {
  return get(`${endPoint}/customerCoupon/availableList`, data);
}

/*-----------------------会员卡----------------------*/
//会员卡列表
function queryCardList(data){
  return get(`${endPoint}/customerCard/list`, data);
}
//会员卡详情
function queryCardDetail(data) {
  return get(`${endPoint}/customerCard/detail`, data);
}

// 会员卡领取
function receiveCard(data){
  return post(`${endPoint}/customerCard/receive`, data);
}

//下单时可领取会员卡列表
function queryOrderCardList(data) {
  return get(`${endPoint}/customerCard/availableList`, data);
}


/*----------------------绑定手机号-------------------------------*/
//绑定手机号/改绑定手机号
function bindMobile(data) {
  return post(`${endPoint}/jmall/bind/excute`, data);
}

//校验用户是否需要绑定
function checkIsBindMobile(data) {
  return get(`${endPoint}/jmall/bind/check`, data);
}

//验证手机号是否已经存在
function checkBindMobileIsExist(data) {
  return get(`${endPoint}/jmall/bind/mobileCheck`, data);
}

//改绑定校验验证码
function checkVerifyCode(data) {
  return post(`${endPoint}/jmall/bind/verifyCodeCheck`, data);
}


/*----------------------积分商城-------------------------------*/

//积分商城首页
function queryScoreBannerList(data) {
  return get(`${endPoint}/jmall/index/all`, data);
}

//积分商城首页商品列表
function queryScoreGoodsList(data) {
  return get(`${endPoint}/jmall/index/goodsList`, data);
}

//积分商城个人中心
function queryScoreUserCenter(data) {
  return get(`${endPoint}/jmall/user/center`, data);
}

//积分商城商品详情页
function queryScoreGoodsDetail(data) {
  return get(`${endPoint}/jmall/goods/detail`, data);
}

//预订单/立即购买
function checkScoreOrder(data) {
  return get(`${endPoint}/jmall/order/prepare`, data);
}

//订单结算/下订单/积分支付
function scoreOrderCreate(data) {
  return post(`${endPoint}/jmall/order/create`, data);
}

//订单列表
function scoreOrderList(data) {
  return get(`${endPoint}/jmall/order/list`, data);
}

//各状态订单数量统计
function scoreOrderCount(data) {
  return get(`${endPoint}/jmall/order/count`, data);
}

//订单详情
function scoreOrderDetail(data) {
  return get(`${endPoint}/jmall/order/detail`, data);
}

export default {
  init,
  getIndexMenu,
  getBrandList,
  getStoreList,
  getGoodsList,
  indexSearch,
  saveIndexKeword,
  getIndexKeWordList,
  removeIndexKeWord,
  getIndexCities,
  searchIndexCity,
  selectIndexCity,
  locationIndexCity,
  getBrandListByLocation,
  getStoreListByLocation,
  getStoreDetail,
  getStorecategoryList,
  getStoreGoodsListByCategory,
  getStoreGoodsList,
  getStoreGoodDetail,
  getGoodStock,
  checkoutSingleOrder,
  createSingleOrder,
  queryOrders,
  showOrder,
  cancelOrder,
  getLogistics,
  queryPaySign,
  getOrderConsignee,
  queryAddressList,
  createAddress,
  updataAddress,
  queryAddressDetail,
  checkAddress,
  saveMessage,
  getVerifyCode,
  login,
  saveUserInfo,
  modifyUserInfo,
  initUser,
  getUserLocation,
  queryUserInfo,
  updateWXUserInfo,
  queryMap,
  getPageById,
  logout,
  queryColor,
  queryCustom,
  queryStoreType,// 预约
  queryStoreGoodsList,
  queryProjectList,
  queryProjectList,
  queryProjectDetail,
  queryStaffList,
  queryStaffDetail,
  queryBookSetting,
  queryLoadTime,
  querySelectProjectList,
  querySelectStaffList,
  commitBookOrder,
  queryBookList,
  queryBookDetail,
  cancelBook,
  queryAlbumsList,
  receiveCoupon,
  queryCouponList,
  queryCouponDetail,
  queryOrderCouponList,
  queryCardList,
  queryCardDetail,
  receiveCard,
  queryOrderCardList,
  bindMobile,
  checkVerifyCode,
  checkIsBindMobile,
  checkBindMobileIsExist,
  queryScoreBannerList,
  queryScoreGoodsList,
  queryScoreUserCenter,
  queryScoreGoodsDetail,
  checkScoreOrder,
  scoreOrderCreate,
  scoreOrderList,
  scoreOrderCount,
  scoreOrderDetail,
  getStoreType,
  bookingCheck,
};
