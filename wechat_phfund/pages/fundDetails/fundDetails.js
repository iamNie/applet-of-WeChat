//fundDeatil.js 
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
var API_URL = util.API_URL
Page({
  data: {
    showLoading: true,//默认加载loading
  },
  onLoad: function (options) {
    var that = this
    that.setData({
      fundCode: options.fundCode,
      showLoading: true
    });
    wx.request({
      url: API_URL + "fundproductdatail.tml?fundCode=" + options.fundCode,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        res.data.info.tsrState = util.formatState(res.data.info.tsrState);
        res.data.info.acctRisk = util.formatRisk(res.data.info.acctRisk);
        res.data.info.avgreturn_day = util.toFixNumber(res.data.info.avgreturn_day, 2);
        res.data.info.yield = util.toFixNumber(res.data.info.yield * 100, 4);
        res.data.info.nav = util.toFixNumber(res.data.info.nav, 4);
        var fundManagerNa = [];
        if (res.data.info.listManager.length > 0) {
          for (var index in res.data.info.listManager) {
            fundManagerNa.push(res.data.info.listManager[index].fundManagerNa);
          }
          var fundManagerNa = fundManagerNa.join('/');
          var fundManagerNo = res.data.info.listManager[0].fundManagerNo;
        }
        that.setData({
          fundDeatil: res.data.info,
          // listManager: res.data.info.listManager,
          fundManagerNa: fundManagerNa,
          fundManagerNo: fundManagerNo,
          showLoading: false
        })
      }
    })
  },
  /**
   * 查看基金经理信息
   */
  viewListManager: function (e) {
    var employeeNo = e.currentTarget.dataset.managerno;
    if (employeeNo == '' || employeeNo == undefined){
      return;
    }
    wx.navigateTo({
      url: '../managerMesssage/managerMesssage?employeeNo=' + employeeNo,
    })
  },
  /**
   * 查看基金概况
   */
  viewFundSituation: function (e) {
    var fundCode = e.currentTarget.dataset.code
    wx.navigateTo({
      url: '../fundSituation/fundSituation?fundCode=' + fundCode,
    })
  },
  /**
   * 费率说明
   */

  rateExplain: function (e) {
    var fundCode = e.currentTarget.dataset.code;
    var fundTypeNum = e.currentTarget.dataset.fundtype;
    wx.navigateTo({
      url: '../rateExplain/rateExplain?fundCode=' + fundCode + '&fundTypeNum=' + fundTypeNum,
    })
  },
  /**
  * 分红情况
  */

  dividend: function (e) {
    var fundCode = e.currentTarget.dataset.code;
    wx.navigateTo({
      url: '../profitShare/profitShare?fundCode=' + fundCode,
    })
  },
  
  /**
   * 日涨幅或者七日年化
   */
  goToNetWorth:function(e){
    var num = e.currentTarget.dataset.num;
    var code = e.currentTarget.dataset.code;
    if(num == '04'){
      //货币基金，七日年化页面
      wx.navigateTo({
        url: '../yeildList/yeildList?fundCode=' + code,
      })
    }else{
      wx.navigateTo({
        url: '../netWorthList/netWorthList?fundCode=' + code,
      })
    }
  },
  navigateBack: function () {
    console.log(11111)
    wx.navigateTo({
      url: '../yeildList/yeildList',
    })
  },
})
