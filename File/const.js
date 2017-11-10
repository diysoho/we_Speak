export default {
  debug: true,
  log: true,
  devEndPoint: 'https://test.huokebao.net/otowap/s',
  proEndPoint: 'https://xcx.huokebao.net/otowap/s',

  action: {
    ORDER_PAID: 'ORDER_PAI',   //订单支付成功
    LOCATION_CHANGED: 'LOCATION_CHANGED', //城市发生变化
    ADDRESS_CHANGED: 'ADDRESS_CHANGED', //搜索地址
    LOGIN_SUCCESS: 'LOGIN_SUCCESS', //登录成功
    NEW_ORDER: 'NEW_ORDER',    //订单结算页面地址选择
    SELECT_CARD_AND_COUPON: 'SELECT_CARD_AND_COUPON',    //订单结算页面地址Card 和 优惠劵
    ADDRESS_SUCCESS: 'ADDRESS_SUCCESS', //通过设置授权地址成功
    ADDRESS_LOCATION_SUCCESS: 'ADDRESS_LOCATION_SUCCESS',//通过收货地址确定坐标
    YUYUE_SERVICE: 'YUYUE_SERVICE', // 预约选择服务项目
    YUYUE_STAFF: 'YUYUE_STAFF', // 预约选择服务人员
  },
}
