// pages/checkSaleAcct1/checkSaleAcct1.js
const app = getApp()
const util = require('../../utils/util.js');
var API_URL = util.API_URL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: true,
    showLoading: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.setStorageSync("identify", options.idCode);
    var imgCodeSession = wx.getStorageSync("imgCodeSession");
    wx.request({
      url: API_URL + 'qryaffconfirm.tml?idType=0&idCode=' + options.idCode + '&qaflg=0&fundNum=8&ecnoNum=5',
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
            fundData: res.data.fundInfo,
            showLoading: false
          })
        } else if (data.reFlg == '2') {
          that.setData({
            flag: false,
            retMsg: '不存在该代销账号！',
          })
        } else {

        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 选择锁钩的基金
   */
  selectFund: function (e) {
    var fundCode = e.currentTarget.dataset.code;
    var that = this
    that.setData({
      'currentTab': fundCode,
      typeTab:fundCode
    })
    wx.setStorageSync("selectCode", fundCode);
  },
  /**
    * 关闭弹框
    */
  powerDrawer: function () {
    var that = this
    that.setData({
      flag: true
    })
  },
  /**
   * 下一步
   */
  next: function () {
    wx.navigateTo({
      url: '../checkSaleAcct2/checkSaleAcct2',
    })
  },
  /**
    * 关闭弹框
    */
  powerDrawer: function () {
    var that = this
    that.setData({
      flag: true
    })
  }
})