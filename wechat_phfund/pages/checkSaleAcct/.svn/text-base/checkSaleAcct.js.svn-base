// pages/checkSaleAcct/checkSaleAcct.js
const app = getApp()
const util = require('../../utils/util.js');
var API_URL = util.API_URL;

Page({

  /**
   * 页面的初始数据
   */
  data: {

    flag: true,
    flag1:true
    // imgCodeSession: util.timeStampFun() + 'abc'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var sessionId = util.timeStampFun() + 'abc';
    wx.setStorageSync("imgCodeSession", sessionId);
    var that = this
    that.setData({
      imgSrc: API_URL + 'imgcode?date=' + util.timeStampFun() + '&sessionId=' + sessionId,
    })
  },
  // 1519797689063abc
  change: function (res) {
    var that = this
    var sessionId = util.timeStampFun() + 'abc';
    wx.setStorageSync("imgCodeSession", sessionId);
    var src = API_URL + 'imgcode?date=' + util.timeStampFun() + '&sessionId=' + sessionId;
    that.setData({
      imgSrc: src,
    })
  },
  //输入身份证号码
  userIdentity: function (e) {
    this.setData({
      identity: e.detail.value
    })
  },
  //输入验证码
  inputYzm: function (e) {
    this.setData({
      imgCode: e.detail.value
    })
  },
  //点击下一步验证代销账号
  next: function () {
    var that = this
    var identity = this.data.identity;
    console.log(identity)
    if (identity == undefined) {
      that.setData({
        flag: false,
        retMsg: '请输入身份证号码！'
      })
      return;
    }
    var imgCode = this.data.imgCode;
    if (imgCode == undefined) {
      that.setData({
        flag: false,
        retMsg: '请输入图形验证码！'
      })
      return;

    }
    var imgCodeSession = wx.getStorageSync("imgCodeSession");
    console.log(imgCodeSession)
    wx.request({
      url: API_URL + 'yzm.tml?imgCode=' + imgCode,
      header: {
        'content-type': 'application/json', // 默认值
        'branchCode': '04',
        'h-version': '8.0.0',
        'channelCode': '002001',
        'sessionId': imgCodeSession
      },
      success: function (res) {
        console.log(res.data)
        // 1520412347908abc
        if (res.data.respCode == '000000') {
          wx.request({
            url: API_URL + 'wechatcheckidcard.tml?certType=0&certNo=' + identity,
            header: {
              'content-type': 'application/json', // 默认值
              'branchCode': '04',
              'h-version': '8.0.0',
              'channelCode': '002001',
              'sessionId': imgCodeSession
            },
            success: function (res) {
              if (res.data.respCode == '000000') {
                that.setData({
                  flag1: false,
                  retMsg: '您已在A加钱包开户，需要使用A加账号进行登录！'
                })
              } else {
                wx.navigateTo({
                  url: '../checkSaleAcct1/checkSaleAcct1?idCode=' + identity,
                })
              }
            },
          })
        
        } else {
          var sessionId = util.timeStampFun() + 'abc';
          wx.setStorageSync("imgCodeSession", sessionId);
          var src = API_URL + 'imgcode?date=' + util.timeStampFun() + '&sessionId=' + sessionId;
          that.setData({
            flag: false,
            retMsg: '验证码错误！',
            imgSrc: src
          })
        }
      },
    })
    

  },
  /**
    * 关闭弹框
    */
  powerDrawer1: function () {
    var that = this
    that.setData({
      flag1: true
    })
    wx.navigateBack({
      url: '../login/login',
    })
  },
  powerDrawer: function () {
    var that = this
    that.setData({
      flag: true
    })
  }
})