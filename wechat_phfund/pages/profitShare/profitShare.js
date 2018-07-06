//profitShare.js
const app = getApp()
const util = require('../../utils/util.js');
var API_URL = util.API_URL
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options.fundCode)
    wx.request({
      url: API_URL + 'funddivident.tml?fundCode=' + options.fundCode +'&pageno=1&pagesz=15',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        for (var index in res.data.funds){
          res.data.funds[index].unitBonus = util.toFixNumber(res.data.funds[index].unitBonus,4);
        }
        that.setData({
          dividendFunds: res.data.funds
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})