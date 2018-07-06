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
    var fundTypeNum = options.fundTypeNum;
    if (fundTypeNum == '04') {
      that.setData({
        fundTypeNum: fundTypeNum
      })
    }
    wx.request({
      url: API_URL+"discountratelist.tml?fundCode=" + options.fundCode + '&shareType=0&businessCode=022&isRateDesc=1',
      data: {

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var discount = res.data.infos[0].discount; // 折扣率
        var soldDiscount = 1;
        wx.request({
          url: API_URL+"qryfundrate.tml?fundCode=" + options.fundCode,
          data: {

          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          success: function (res) {
            if (res.data.list.length > 0) {
              that.setData({
                managementRate: res.data.list[0].managementRate,
                managedRate: res.data.list[0].managedRate,
                serviceRate: res.data.list[0].serviceRate,
                showLoading:false
              })
            }
            for (var index in res.data.list) {
              if (res.data.list[index].transType == '022') {//申购
                for (var i in res.data.list[index].iteamlist) {
                  if (res.data.list[index].iteamlist[i].amountMin >= 10000) {
                    res.data.list[index].iteamlist[i].amountMin = (res.data.list[index].iteamlist[i].amountMin) / 10000 + '万';
                  }
                  if (res.data.list[index].iteamlist[i].amountMax >= 10000) {
                    res.data.list[index].iteamlist[i].amountMax = (res.data.list[index].iteamlist[i].amountMax) / 10000 + '万';
                  }
                  res.data.list[index].iteamlist[i].share_class = util.toFixNumber(res.data.list[index].iteamlist[i].rateStandards * discount, 2);//当成折扣率
                }
                that.setData({
                  buyRateList: res.data.list[index].iteamlist,
                })
              } else if (res.data.list[index].transType == '024') {
                for (var i in res.data.list[index].iteamlist) {
                  if (res.data.list[index].iteamlist[i].share_class == '0.0000'){
                    res.data.list[index].iteamlist[i].share_class = '0.00';
                  }
                  res.data.list[index].iteamlist[i].share_class = util.toFixNumber(res.data.list[index].iteamlist[i].rateStandards * soldDiscount, 2);//当成折扣率
                res.data.list[index].iteamlist.fee_const = util.toFixNumber(res.data.list[index].iteamlist.fee_const, 2);
                }
                console.log(res.data.list[index].iteamlist)
                that.setData({
                  sellRateList: res.data.list[index].iteamlist,
                  showLoading:false
                })
              }
            }
          }
        })
      }
    })
  },
  /**
   * 查看基金详情
   */
  fundDetail: function (e) {
    var fundCode = e.currentTarget.dataset.code
    wx.navigateTo({
      url: '../fundDetails/fundDetails?fundCode=' + fundCode,
    })
  }
})
