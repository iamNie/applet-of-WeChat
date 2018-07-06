// pages/milrev/milrev.js
const util = require('../../utils/util.js');
var API_URL = util.API_URL
var url = API_URL + "qryWalletProInfo.tml";
// var pageno = 1;
var pagesz = 20;
var startd = util.addDate(util.currentDate(), -360);
var enddat = util.getNowDate();
var loadMore = function (that, pageno) {
  that.setData({
    hidden: false
  });
  wx.request({
    url: url,
    data: {
      pageno: pageno,
      pagesz: pagesz,
      startd: startd,
      enddat: enddat,
    },
    success: function (res) {
      var list = that.data.list;
      if (pageno == '1') {
        var maxMilrev = util.toFixNumber(res.data.wyield[0].milrev, 4); //最大万份收益
        for (var index in res.data.wyield) {
          list.push(res.data.wyield[index]);
          res.data.wyield[index].milrev = util.toFixNumber(res.data.wyield[index].milrev, 4);
          res.data.wyield[index].dateee = util.formatTime1(res.data.wyield[index].dateee);
          if (res.data.wyield[index].milrev >= maxMilrev) {
            maxMilrev = res.data.wyield[index].milrev;
          } else {
            maxMilrev = maxMilrev;
          }
        }
        wx.setStorageSync('maxMilrev', maxMilrev);//存储最大的万份收益
        for (var index in res.data.wyield) {
          if (res.data.wyield[index].milrev == maxMilrev) {
            res.data.wyield[index].width = 95;
          } else {
            res.data.wyield[index].width = 95 * Number(res.data.wyield[index].milrev) / maxMilrev;
          }
          if (res.data.wyield[index].width > 100) {
            res.data.wyield[index].width = 100;
          }
          if (res.data.wyield[index].width < 40) {
            res.data.wyield[index].width = 40;
          }
          if (index == '0') {
            res.data.wyield[0].bgcolor = '#C63126';
          } else {
            res.data.wyield[index].bgcolor = '#999999';
          }
        }
      } else {
        var maxMilrev = wx.getStorageSync('maxMilrev');//获取最大的万份收益
        for (var index in res.data.wyield) {
          res.data.wyield[index].milrev = util.toFixNumber(res.data.wyield[index].milrev, 4);
          res.data.wyield[index].dateee = util.formatTime1(res.data.wyield[index].dateee)
          list.push(res.data.wyield[index]);
          if (res.data.wyield[index].milrev == maxMilrev) {
            res.data.wyield[index].width = 95;
          } else {
            res.data.wyield[index].width = 95 * Number(res.data.wyield[index].milrev) / maxMilrev;
          }
          if (res.data.wyield[index].width > 100) {
            res.data.wyield[index].width = 100;
          }
          if (res.data.wyield[index].width < 40) {
            res.data.wyield[index].width = 40;
          }
          res.data.wyield[index].bgcolor = '#999999';
        }
      }

      that.setData({
        list: list
      });
      pageno++;
      wx.setStorageSync('pageno', pageno);
      that.setData({
        hidden: true
      });
    },
    complete: function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
      wx.stopPullDownRefresh() //停止下拉刷新
    }
  });
}

Page({
  data: {
    hidden: true,
    list: [],
    scrollTop: 0,
    scrollHeight: 0
  },
  onLoad: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          scrollHeight: res.windowHeight
        });
      }
    });
    var pageno = 1;
    loadMore(that, pageno);
  },
  bindDownLoad: function () {
    var that = this;
    var pageno = wx.getStorageSync('pageno');
    loadMore(that, pageno);
  },
  scroll: function (event) {
    //该方法绑定了页面滚动时的事件，我这里记录了当前的position.y的值,为了请求数据之后把页面定位到这里来。
    this.setData({
      scrollTop: event.detail.scrollTop
    });
  },
  topLoad: function (event) {
    //  该方法绑定了页面滑动到顶部的事件，然后做上拉刷新
    page = 1;
    this.setData({
      list: [],
      scrollTop: 0
    });
    loadMore(this);
  },
})