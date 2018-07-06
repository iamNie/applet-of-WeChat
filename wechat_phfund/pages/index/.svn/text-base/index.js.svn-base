//my.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
// var WXBizDataCrypt = require('../../utils/RdWXBizDataCrypt.js');
var API_URL = util.API_URL
var height = 0;
Page({
  data: {
    showLoading: true,
    success: true
  },
  //获取用户微信绑定的手机号
  getPhoneNumber: function (e) {
    console.log(e)
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
    var appId = 'wxf6508610ec0aa652'
    var sessionKey = 'HyVFkGl5F5OQWJZZaNzBBg=='
    var pc = new WXBizDataCrypt(appId, sessionKey)
    console.log(pc)
    var data = pc.decryptData(e.detail.encryptedData, e.detail.iv)

    // var appId = 'wxf6508610ec0aa652'
    // var sessionKey = 'tiihtNczf5v6AKRyjwEUhQ=='
    // var encryptedData = e.detail.encryptedData

    // var iv = e.detail.iv

    // var pc = new WXBizDataCrypt(appId, sessionKey)

    // var data = pc.decryptData(encryptedData, iv)

    console.log('解密后 data: ', data)
  },
  //设置转发按钮
  onShareAppMessage: function (res) {
    var that = this

    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '鹏华A加钱包',
      path: '/pages/index/index',
      success: function (res) {
        that.setData({
          success: false
        })
        setTimeout(function () {
          that.setData({
            success: true
          })//要延时执行的代码  
        }, 1000) //延迟时间 这里是1秒
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (res) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.model)
        console.log(res.system)
        if (res.windowHeight <= 456) {
          that.setData({
            height: 185 + 'px'
          })
        }
        else if (res.windowHeight >= 624) {
          that.setData({
            height: 230 + 'px'
          })
        } else {
          that.setData({
            height: 213 + 'px'
          })
        }
      }
    });
    var that = this
    wx.request({
      url: API_URL + "productrecommlist.tml?fundSubType=005",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var array = [];
        for (var index in res.data.list) {
          var obj = {};
          obj.fundCode = res.data.list[index].fundCode;
          for (var i in res.data.list[index].keyGroup[0].keyList) {
            var list = res.data.list[index].keyGroup[0].keyList[i];
            if (list.key_type == '01') {
              obj.key_name = list.key_name;
              obj.key_msg = list.key_msg;
            }
            if (list.key_type == '03') {
              obj.key_subname = list.key_name
              if (list.key_subtype == '001' || list.key_subtype == '003') {
                obj.key_value = util.toFixNumber(list.key_value, 4);
              } else if (list.key_subtype == '002') {
                obj.key_value = util.toFixNumber(list.key_value, 4);
              } else if (list.key_subtype == '000') {
                obj.key_value = list.key_value;
              } else if (list.key_subtype == '004' || list.key_subtype == '006' || list.key_subtype == '007' || list.key_subtype == '008' || list.key_subtype == '008' || list.key_subtype == '009' || list.key_subtype == '010' || list.key_subtype == '011' || list.key_subtype == '012' || list.key_subtype == '013') {
                obj.key_value = util.toFixNumber(list.key_value, 2);
              } else {
                obj.key_value = util.toFixNumber(list.key_value, 2);
              }
            } else {

            }

          }
          array.push(obj);
        }
        that.setData({
          array: array,
        })
      }
    });
    var startd = util.getBeforeDate(7);// 起始时间
    var enddat = util.getNowDate();// 截止时间
    var incodt = util.getNowDate();
    wx.request({
      url: API_URL + "qryWalletInfo.tml?startd=" + startd + "&enddat=" + enddat + "&incodt=" + incodt,
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        if (res.data.respCode == '000000') {
          that.setData({
            milrev: res.data.walout.milrev,
            wekyie: util.toFixNumber(res.data.walout.wyield[res.data.walout.wyield.length - 1].wekyie * 100, 4),
            showLoading: false
          })
        } else {
          that.setData({
            showLoading: false
          })
        }
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true,
          })
        }
      })
    }
  },

  /**
   * 查看更多基金
   */
  goToMoreFund: function () {
    wx.navigateTo({
      // url:'../h5/h5'
      url: '../fundShop/fundShop',
    })
  },
  /**
   * 查看基金详情
   */
  goToDetail: function (e) {
    var fundCode = e.currentTarget.dataset.code
    wx.navigateTo({
      url: '../fundDetails/fundDetails?fundCode=' + fundCode,
    })
  },
  /**
   * 查看万份收益
   */
  goMilrev: function () {
    wx.navigateTo({
      url: '../milrev/milrev',
    })
  },
  /**
  * 查看七日年化
  */
  goWekyie: function () {
    wx.navigateTo({
      url: '../wekyie/wekyie',
    })
  }
})
