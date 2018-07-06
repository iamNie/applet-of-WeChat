// pages/checkSaleAcct1/checkSaleAcct1.js
const app = getApp()
const util = require('../../utils/util.js');
var API_URL = util.API_URL;
var maxNum = 0;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showLoading: true,
    color: '#333',
    flag: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var idCode = wx.getStorageSync("identify");

    var imgCodeSession = wx.getStorageSync("imgCodeSession");

    wx.request({
      url: API_URL + 'qryaffconfirm.tml?idType=0&idCode=' + idCode + '&qaflg=0&fundNum=8&ecnoNum=5',
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
            ecnoInfo: res.data.ecnoInfo,
            showLoading: false
          })
        } else {

        }
      }
    })
    // "qryconfirmerronum.tml?idType=" + idType + "&idCode=" + idCode
    //查询验证交易允许错误次数
    // https://ishare.phfund.com.cn/wechattest/parainfo.tml?key=wechataffconfirmerrornum
    // wx.request({
    //   url: API_URL + "parainfo.tml?key=wechataffconfirmerrornum",
    //   header: {
    //     'content-type': 'application/json', // 默认值
    //     'branchCode': '02',
    //     'h-version': '8.0.0',
    //     'channelCode': '002001',
    //     'sessionId': imgCodeSession
    //   },
    //   success: function (res) {
    //     if (res.data.respCode == '000000') {
    //       maxNum = res.data.paraValue;
    //     } else {
    //       that.setData({
    //         flag:true,
    //         retMsg:'系统繁忙，请稍后再试！'
    //       })
    //     }
    //   },
    //   fail: function (res) { },
    //   complete: function (res) { },
    // })
  },
  /**
   * 选择渠道
   */
  selectEnco: function (e) {
    var ecnoNo = e.currentTarget.dataset.ecno;
    wx.setStorageSync("ecnoNo", ecnoNo);
    this.setData({
      current: ecnoNo,
    });
  },
  /**
    * 关闭弹框
    */
  powerDrawer: function () {
    var that = this
    that.setData({
      flag: true
    })
    wx.navigateTo({
      url: '../checkFail/checkFail',
    })
  },
  /**
   * 下一步去验证
   */
  next: function (e) {
    var that = this
    that.setData({
      showLoading: true
    })
    var imgCodeSession = wx.getStorageSync("imgCodeSession");
    wx.request({
      url: API_URL + "parainfo.tml?key=wechataffconfirmerrornum",
      header: {
        'content-type': 'application/json', // 默认值
        'branchCode': '04',
        'h-version': '8.0.0',
        'channelCode': '002001',
        'sessionId': imgCodeSession
      },
      success: function (res) {
        if (res.data.respCode == '000000') {
          maxNum = res.data.paraValue;
        } else {
          that.setData({
            flag: false,
            retMsg: '系统繁忙，请稍后再试！'
          })
          return;
        }
      }
    })
   
    var idCode = wx.getStorageSync("identify");
    var idNumber = idCode;
    var errorTime = wx.getStorageSync('errorTime');
    var yzTime = Date.parse(new Date());
    if (errorTime != '') {
      if (24*60*60000 < yzTime - errorTime) {
        wx.setStorageSync(idNumber, 1);
        wx.clearStorageSync("errorTime", "");
      }
    }
    var num = wx.getStorageSync(idNumber);//获取本地存储的错误次数
    if (num != '') {
      if (num >= maxNum) {
        that.setData({
          flag: false,
          showLoading: false,
          retMsg: '验证失败次数超限，请于24小时后再试。'
        })
        return;
      }
    }
    var fundCode = wx.getStorageSync("selectCode");
    // var idCode = wx.getStorageSync("identify");
    var ecnoNo = wx.getStorageSync("ecnoNo");
    // var imgCodeSession = wx.getStorageSync("imgCodeSession");
    wx.request({
      url: API_URL + 'affconfirm.tml?idType=0&idCode=' + idCode + '&qaflg=1&fundCode=' + fundCode + '&realTaEcno=' + ecnoNo,
      header: {
        'content-type': 'application/json', // 默认值
        'branchCode': '04',
        'h-version': '8.0.0',
        'channelCode': '002001',
        'sessionId': imgCodeSession
      },
      success: function (res) {
        if (res.data.reFlg == '0') {
          that.setData({
            showLoading: false,
            retMsg: '代销账户信息错误或无持仓基金，无法绑定'
          })
          wx.navigateTo({
            url: '../checkSuccess/checkSuccess',
          })
        } else {
          var num = wx.getStorageSync(idNumber);//获取本地存储的错误次数
          if (num == '' || num == undefined) {
            wx.setStorageSync(idNumber, 1);//本地存储验证的错误次数
          } else {
            wx.setStorageSync(idNumber, num + 1);//本地存储验证的错误次数
          }
          if ((num + 1) == maxNum){
            that.setData({
              flag: false,
              showLoading: false,
              retMsg: "验证失败次数超限，请于24小时后再试。"
            })
            var errorTime = Date.parse(new Date());
            wx.setStorageSync("errorTime", errorTime);
          }else{
            that.setData({
              flag:false,
              showLoading: false,
              retMsg: "验证错误" + (num + 1) + "次,连续错误" + maxNum + "次，账号将被锁定24小时"
            })
          }
        }
      },
    })
  }
})