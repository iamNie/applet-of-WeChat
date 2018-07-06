// pages/wekyie/wekyie.js
const util = require('../../utils/util.js');
var API_URL = util.API_URL
var url = API_URL + "qryWalletProInfo.tml";

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
        var maxWekyie = util.toFixNumber(res.data.wyield[0].wekyie, 4); //最大七日年化收益率
        for (var index in res.data.wyield) {
          list.push(res.data.wyield[index]);
          res.data.wyield[index].wekyie = util.toFixNumber(res.data.wyield[index].wekyie * 100, 4);
          res.data.wyield[index].dateee = util.formatTime1(res.data.wyield[index].dateee);
          if (res.data.wyield[index].wekyie >= maxWekyie) {
            maxWekyie = res.data.wyield[index].wekyie;
          } else {
            maxWekyie = maxWekyie;
          }
        }
        wx.setStorageSync('maxWekyie', maxWekyie);//存储最大七日年化收益率
        for (var index in res.data.wyield) {
          if (res.data.wyield[index].wekyie == maxWekyie) {
            res.data.wyield[index].width = 95;
          } else {
            res.data.wyield[index].width = 95 * Number(res.data.wyield[index].wekyie) / maxWekyie;
          }
          if (res.data.wyield[index].width > 100) {
            res.data.wyield[index].width = 100;
          }
          if (res.data.wyield[index].width < 52) {
            res.data.wyield[index].width = 52;
          }
          if (index == '0') {
            res.data.wyield[0].bgcolor = '#C63126';
          } else {
            res.data.wyield[index].bgcolor = '#999999';
          }
        }
      } else {
        var maxWekyie = wx.getStorageSync('maxWekyie');//获取最大七日年化收益率
        for (var index in res.data.wyield) {
          res.data.wyield[index].dateee = util.formatTime1(res.data.wyield[index].dateee);
          res.data.wyield[index].wekyie = util.toFixNumber(res.data.wyield[index].wekyie * 100, 4);
          list.push(res.data.wyield[index]);
          if (res.data.wyield[index].wekyie == maxWekyie) {
            res.data.wyield[index].width = 95;
          } else {
            res.data.wyield[index].width = 95 * Number(res.data.wyield[index].wekyie) / maxWekyie;
          }
          if (res.data.wyield[index].width > 100) {
            res.data.wyield[index].width = 100;
          }
          if (res.data.wyield[index].width < 52) {
            res.data.wyield[index].width = 52;
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