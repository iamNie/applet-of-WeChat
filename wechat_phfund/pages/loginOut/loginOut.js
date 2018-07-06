//loginOut.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  //登录
  gotoLogin: function () {
    wx.navigateTo({
      url: '../login/login',
    })
  },
  loginOut: function (res) {
    // wx.navigateTo({
    //   url: '../fundDetail/fundDetail',
    // })
    var that = this
    wx.request({
      url: "https://ishare.phfund.com.cn/wechattest/fundproductlist.tml?pageno=1&pagesz=10&versionFlag=1&serviceType=2&fundType=09&sortType=1&navSort=0&keyword=160632&share_class=0",
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          haha: res.data,
        })
      }
    })
  },
  onLoad: function (res) {
    console.log(111)
    var that = this
    wx.request({
      url: "https://ishare.phfund.com.cn/wechattest/fundproductdatail.tml?fundCode=000290",
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        console.log(res.data);
        that.setData({
          haha: res.data,
        })
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
            hasUserInfo: true
          })
        }
      })
    }
  },
  downloadApp:function(){
    wx.navigateTo({
      url: 'http://a.app.qq.com/o/simple.jsp?pkgname=com.phfund.wallet',
    })
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
