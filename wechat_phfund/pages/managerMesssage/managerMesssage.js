//fundDeatil.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
var API_URL = util.API_URL

Page({
  data: {
    showLoading:true
  },
  onLoad: function (options) {
    var that = this
    wx.request({
      url: API_URL+"fundmanagerinformation.tml?employeeNo=" + options.employeeNo,
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          fundList: res.data.infos[0].fundList,
          managerMessage: res.data.infos[0],
          showLoading:false
        })
      }
    })
  },
  /**
   * 查看基金详情
   */
  fundDetail:function(e){
    var fundCode = e.currentTarget.dataset.code
    wx.navigateTo({
      url: '../fundDetails/fundDetails?fundCode=' + fundCode,
    })
  }
})
