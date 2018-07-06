// pages/sellAssets/sellAssets.js
const app = getApp()
const util = require('../../utils/util.js');
var API_URL = util.API_URL;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag:true,
    totalzc: "人民币代销资产",
    unit: '元',
    showImg: true,
    showLoading:true,
    showMore:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var sessionId = util.timeStampFun() + 'abc';
    var idCode = wx.getStorageSync("identify");
    var idCode = '513001195610010022';
    //查询人民币代销资产
    wx.request({
      url: API_URL + 'affasset.tml?currencyType=156&idType=0&idCode=' + idCode + '&token=null&deviceId=shebeihaoshipc',
      header: {
        'content-type': 'application/json', // 默认值
        'branchCode': '04',
        'h-version': '8.0.0',
        'channelCode': '002001',
        'sessionId': sessionId
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        if (res.data.respCode == '000000') {
          if (res.data.consignAssetsOut.length > 0) {
            var totalPrice = 0;
            for (var index in res.data.consignAssetsOut) {
              totalPrice += res.data.consignAssetsOut[index].totalPrice;
              for (var i in res.data.consignAssetsOut[index].fundShareList) {
                res.data.consignAssetsOut[index].fundShareList[i].totalShare = util.toThousands(res.data.consignAssetsOut[index].fundShareList[i].totalShare, 2);
              }
            }
            console.log(totalPrice)
            that.setData({
              showAplus: true,
              showAll: false,
              sellsAsset: res.data.consignAssetsOut,
              sumamt: util.toThousands(totalPrice, 2),
              showMore:false
            })
            wx.request({
              url: API_URL + 'affasset.tml?currencyType=840&idType=0&idCode=' + idCode + '&token=null&deviceId=shebeihaoshipc',
              header: {
                'content-type': 'application/json', // 默认值
                'branchCode': '04',
                'h-version': '8.0.0',
                'channelCode': '002001',
                'sessionId': sessionId
              },
              method: 'POST',
              success: function (res) {
                if (res.data.consignAssetsOut.length > 0) {
                  that.setData({
                    showImg: false,
                    showLoading: false
                  })
                } else {
                  that.setData({
                    showImg: true,
                    showLoading: false
                  })
                }
              },
            })
          } else {
            wx.request({
              url: API_URL + 'affasset.tml?currencyType=840&idType=' + idtftp + '&idCode=' + idtfno + '&token=' + g_token + '&deviceId=shebeihaoshipc',
              header: {
                'content-type': 'application/json', // 默认值
                'branchCode': '04',
                'h-version': '8.0.0',
                'channelCode': '002001',
                'sessionId': sessionId1
              },
              method: 'POST',
              success: function (res) {
                if (res.data.consignAssetsOut.length > 0) {
                  var totalPrice = 0;
                  for (var index in res.data.consignAssetsOut) {
                    totalPrice += res.data.consignAssetsOut[index].totalPrice;
                    for (var i in res.data.consignAssetsOut[index].fundShareList) {
                      res.data.consignAssetsOut[index].fundShareList[i].totalShare = util.toThousands(res.data.consignAssetsOut[index].fundShareList[i].totalShare, 2);
                    }
                  }
                  that.setData({
                    showAplus: true,
                    showAll: false,
                    sellsAsset: res.data.consignAssetsOut,
                    // onlyDollar: 1,
                    sumamt: util.toThousands(totalPrice, 2),
                    showImg: false
                  })
                } else {
                  that.setData({
                    showAplus: false,
                    showAll: true,
                    // onlyDollar: 0,
                    showImg: true
                  })
                }
              },
            })
          }
        }
      },
    })
  },
  /**下拉显示美元和元资产 */
  switch: function () {
    var that = this
    that.setData({
      openPicker: !this.data.openPicker,
    })
  },
  /**
   * 切换美元和人民币代销资产
   */
  changeType: function (e) {
    var that = this
    var sessionId = util.timeStampFun() + 'abc';
    // var idCode = wx.getStorageSync("identify");
    var idCode = '513001195610010022';
    var index = e.currentTarget.dataset.index;
    that.setData({
      showLoading:false
    })
    if (index == '156') {
      wx.request({
        url: API_URL + 'affasset.tml?currencyType=156&idType=0&idCode=' + idCode + '&token=null&deviceId=shebeihaoshipc',
        header: {
          'content-type': 'application/json', // 默认值
          'branchCode': '04',
          'h-version': '8.0.0',
          'channelCode': '002001',
          'sessionId': sessionId
        },
        method: 'POST',
        success: function (res) {
          if (res.data.consignAssetsOut.length > 0) {
            var totalPrice = 0;
            for (var index in res.data.consignAssetsOut) {
              totalPrice += res.data.consignAssetsOut[index].totalPrice;
              for (var i in res.data.consignAssetsOut[index].fundShareList) {
                res.data.consignAssetsOut[index].fundShareList[i].totalShare = util.toThousands(res.data.consignAssetsOut[index].fundShareList[i].totalShare, 2);
              }
            }
            that.setData({
              showAplus: true,
              showAll: false,
              sellsAsset: res.data.consignAssetsOut,
              sumamt: util.toThousands(totalPrice, 2),
              showLoading: false
            })
          } else {

          }
        }
      })
      that.setData({
        unit: '元',
        totalzc: '人民币代销资产',
        openPicker: false,
        showLoading: true,
      })
    } else {
      wx.request({
        url: API_URL + 'affasset.tml?currencyType=840&idType=0&idCode=' + idCode + '&token=null&deviceId=shebeihaoshipc',
        header: {
          'content-type': 'application/json', // 默认值
          'branchCode': '04',
          'h-version': '8.0.0',
          'channelCode': '002001',
          'sessionId': sessionId
        },
        method: 'POST',
        success: function (res) {

          if (res.data.consignAssetsOut.length > 0) {
            var totalPrice = 0;
            for (var index in res.data.consignAssetsOut) {
              totalPrice += res.data.consignAssetsOut[index].totalPrice;
              for (var i in res.data.consignAssetsOut[index].fundShareList) {
                res.data.consignAssetsOut[index].fundShareList[i].totalShare = util.toThousands(res.data.consignAssetsOut[index].fundShareList[i].totalShare, 2);
              }
            }
            that.setData({
              showAplus: true,
              showAll: false,
              sellsAsset: res.data.consignAssetsOut,
              totalPrice: util.toThousands(totalPrice, 2),
              sumamt: util.toThousands(totalPrice, 2),
              showLoading: false
            })
          } else {
            that.setData({
              showAplus: false,
              showAll: true,
            })
          }
        },
      })
      that.setData({
        unit: '美元',
        totalzc: '美元代销资产',
        openPicker: false,
        showLoading: true,
      })
    }
  },
  /**查看更多基金 */
  viewFundDetail:function(){
    wx.navigateTo({
      url: '../fundShop/fundShop',
    })
  }
})