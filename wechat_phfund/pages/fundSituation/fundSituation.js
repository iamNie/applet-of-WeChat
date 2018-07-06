//fundDeatil.js https://ishare.phfund.com.cn/wechattest/fundproductdatail.tml?fundCode=000905 
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
var API_URL = util.API_URL
Page({
  data: {
    showLoading: true,
    tipsName:'最低申购金额'
  },
  onLoad: function (options) {
    var that = this
    wx.request({
      url: API_URL + "fundbasic.tml?fundCode=" + options.fundCode,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        res.data.info.faceValue = util.toFixNumber(res.data.info.faceValue, 1);
        console.log(res.data);
        that.setData({
          fundMessage: res.data.info,
        })
      }
    })
    wx.request({
      url: API_URL + "fundproductdatail.tml?fundCode=" + options.fundCode,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var lowren;
        var lowshen;
        for (var i = 0; i < res.data.info.listFundMony.length; i++) {
          if (res.data.info.listFundMony[i].business_code === "020") {//认购期
            lowren = res.data.info.listFundMony[i].min_subs_amount;
          } else if (res.data.info.listFundMony[i].business_code === "022") {//申购期
            lowshen = res.data.info.listFundMony[i].min_subs_amount;
          }
        }
        if (res.data.info.tsrState == '1') {
          that.setData({
            tipsName:'最低认购金额',
            lowren: lowren,
            showLoading: false
          })
        } else {
          that.setData({
            tipsName: '最低申购金额',
            lowren: lowshen,
            showLoading: false
          })
        }
      }
    })
  },
  /**
   * 查看基金经理信息
   */
  viewListManager: function (e) {
    var employeeNo = e.currentTarget.dataset.managerno
    wx.navigateTo({
      url: '../managerMesssage/managerMesssage?employeeNo=' + employeeNo,
    })
  }
})
