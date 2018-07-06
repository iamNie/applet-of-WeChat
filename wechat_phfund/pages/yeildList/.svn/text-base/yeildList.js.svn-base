// pages/netWorthList/netWorthList.js
const app = getApp()
const util = require('../../utils/util.js');
var API_URL = util.API_URL

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
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winHeight: res.windowHeight,
        });
      }
    });
    // var fundCode = options.fundCode
    var startDate = util.getBeforeDate(360);// 起始时间
    var endDate = util.getNowDate();// 截止时间
    wx.request({
      url: API_URL + "fundnetassetvaluelist.tml?fundCode=" + options.fundCode + "&startDate=" + startDate + "&endDate=" + endDate,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.respCode == '000000') {
          for (var index in res.data.infos) {
            res.data.infos[index].milrev = util.toFixNumber(res.data.infos[index].milrev, 4);//累计净值格式化
            res.data.infos[index].yield = util.toFixNumber(res.data.infos[index].yield*100, 4);//日涨幅格式化
            res.data.infos[index].nav_date = util.formatTime1(res.data.infos[index].nav_date, 4);//时间格式化
          }
          res.data.infos = res.data.infos.reverse();
          that.setData({
            showLoading: false,
            flag: true,
            netWorthList: res.data.infos
          })
        } else {
          that.setData({
            showLoading: false,
            retMsg: res.data.respMsg,
            flag: false
          })
        }
      },
      fail: function (res) {

      },
      complete: function (res) { },
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