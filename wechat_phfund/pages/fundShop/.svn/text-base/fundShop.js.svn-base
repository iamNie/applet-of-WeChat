//fundShop.js
var app = getApp()
const util = require('../../utils/util.js');
var API_URL = util.API_URL
Page({
  data: {
    winWidth: 0,
    winHeight: 0,
    // tab切换  
    currentTab: "01",
    changeSortType: "日涨幅",
    openPicker: false,//默认关闭选择
    changeImg: false,
    fundType: "01",//默认搜索股票型基金
    // sortType: "1",//默认是日涨幅
    showLoading: true,//默认加载loading
    indexTab: "1"//默认日涨幅的颜色
  },
  onLoad: function () {
    var that = this
    /** 
     * 获取系统信息 
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight + 100,
        });
      }
    });
    wx.setStorageSync('sorttype1', '1');//存储排序类型
    wx.setStorageSync('fundType1', '01');//存储基金类型
    wx.request({
      url: API_URL + "fundproductlist.tml?pageno=1&pagesz=15&versionFlag=1&fundType=01&sortType=1&navSort=0",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        for (var index in res.data.infos) {
          res.data.infos[index].nav = util.toFixNumber(res.data.infos[index].nav, 4);//单位净值格式化
          res.data.infos[index].changeDate = util.formatTime1(res.data.infos[index].changeDate, 4);//时间格式化
          if (res.data.infos[index].avgreturnDay == '') {
            res.data.infos[index].yield = "--";
          } else {
            res.data.infos[index].yield = util.toFixNumber(res.data.infos[index].avgreturnDay, 2);
          }
        }
        if (res.data.infos.length == 0) {
          that.setData({
            fundData: res.data.infos,
            winHeight: 270,
            showLoading: false,
          })
        } else {
          that.setData({
            fundData: res.data.infos,
            winHeight: res.data.infos.length * 54 + 30,
            showLoading: false,
          })
        }
      }
    })
  },
  /**
   * 点击切换tab
   */
  swichNav: function (e) {
    var that = this
    var fundType = e.target.dataset.current
    this.setData({
      fundData: "",
      showLoading: true,
      fundType: fundType,
      openPicker: false,
      changeImg: false
    });
    var sorttype1 = wx.getStorageSync('sorttype1');//本地获取sortType
    var indexTab = wx.getStorageSync('indexTab');//本地获取sortType
    wx.setStorageSync('fundType1', fundType);//存储基金类型
    if (fundType == '04'){//如果是货币基金的话，默认展示七日年化
      sorttype1 = 9;
      this.setData({
        changeSortType: "七日年化",
        indexTab:'9'
      });
    }else{
      sorttype1 = sorttype1;
      this.setData({
        changeSortType: util.formatSortType(sorttype1),
        indexTab: indexTab
      });
    }
    wx.request({
      url: API_URL + "fundproductlist.tml?pageno=1&pagesz=10&versionFlag=1&fundType=" + fundType + "&sortType=" + sorttype1 + "&navSort=0",
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        for (var index in res.data.infos) {
          res.data.infos[index].nav = util.toFixNumber(res.data.infos[index].nav, 4);//单位净值格式化
          res.data.infos[index].changeDate = util.formatTime1(res.data.infos[index].changeDate, 4);//时间格式化
          if (sorttype1 == '1') {
            if (res.data.infos[index].avgreturnDay == "") {
              res.data.infos[index].yield = '--';
            } else {
              res.data.infos[index].yield = util.toFixNumber(res.data.infos[index].avgreturnDay, 2);
            }
          } else if (sorttype1 == '3') {
            if (res.data.infos[index].avgreturnMonth == "") {
              res.data.infos[index].yield = '--';
            } else {
              res.data.infos[index].yield = util.toFixNumber(res.data.infos[index].avgreturnMonth, 2);
            }
          } else if (sorttype1 == '4') {
            if (res.data.infos[index].avgreturnQuarter == "") {
              res.data.infos[index].yield = '--';
            } else {
              res.data.infos[index].yield = util.toFixNumber(res.data.infos[index].avgreturnQuarter, 2);
            }
          } else if (sorttype1 == '5') {
            if (res.data.infos[index].avgreturnHalfyear == "") {
              res.data.infos[index].yield = '--';
            } else {
              res.data.infos[index].yield = util.toFixNumber(res.data.infos[index].avgreturnHalfyear, 2);
            }
          } else if (sorttype1 == '6') {
            if (res.data.infos[index].avgreturnYear == "") {
              res.data.infos[index].yield = '--';
            } else {
              res.data.infos[index].yield = util.toFixNumber(res.data.infos[index].avgreturnYear, 2);
            }
          } else if (sorttype1 == '9') {
            if (res.data.infos[index].yield == "") {
              res.data.infos[index].yield = '--';
            } else {
              res.data.infos[index].yield = util.toFixNumber(res.data.infos[index].yield*100, 4);
            }
          }
        }
        if (res.data.infos.length == 0) {
          that.setData({
            fundData: res.data.infos,
            currentTab: e.target.dataset.current,
            showLoading: false,
            winHeight: 270,
          })
        } else {
          that.setData({
            fundData: res.data.infos,
            currentTab: e.target.dataset.current,
            showLoading: false,
            winHeight: res.data.infos.length * 54 + 30,
          })
        }
      }
    })
    // }
  },
  /**
   * 选择不同时间段进行展示
   */
  switchSortType: function (e) {
    var that = this
    var type = e.currentTarget.dataset.type
    var fundType1 = wx.getStorageSync('fundType1');//本地获取基金类型
    wx.setStorageSync("indexTab", e.target.dataset.index);//本地存储indexTab
    this.setData({
      fundData: "",
      changeSortType: util.formatSortType(type),
      showLoading: true,
      indexTab: e.target.dataset.index
    });
    wx.setStorageSync('sorttype1', type);//存储sortType
    var fundType1 = wx.getStorageSync('fundType1');//本地获取基金类型
    wx.request({
      url: API_URL + "fundproductlist.tml?pageno=1&pagesz=15&versionFlag=1&fundType=" + fundType1 + "&sortType=" + type + "&navSort=0",
      data: {
        x: '',
        y: ''
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        for (var index in res.data.infos) {
          res.data.infos[index].nav = util.toFixNumber(res.data.infos[index].nav, 4);//单位净值格式化
          res.data.infos[index].changeDate = util.formatTime1(res.data.infos[index].changeDate, 4);//时间格式化
          if (type == '1') {
            if (res.data.infos[index].avgreturnDay == "") {
              res.data.infos[index].yield = '--';
            } else {
              res.data.infos[index].yield = util.toFixNumber(res.data.infos[index].avgreturnDay, 2);
            }
          } else if (type == '3') {
            if (res.data.infos[index].avgreturnMonth == "") {
              res.data.infos[index].yield = '--';
            } else {
              res.data.infos[index].yield = util.toFixNumber(res.data.infos[index].avgreturnMonth, 2);
            }
          } else if (type == '4') {
            if (res.data.infos[index].avgreturnQuarter == "") {
              res.data.infos[index].yield = '--';
            } else {
              res.data.infos[index].yield = util.toFixNumber(res.data.infos[index].avgreturnQuarter, 2);
            }
          } else if (type == '5') {
            if (res.data.infos[index].avgreturnHalfyear == "") {
              res.data.infos[index].yield = '--';
            } else {
              res.data.infos[index].yield = util.toFixNumber(res.data.infos[index].avgreturnHalfyear, 2);
            }
          } else if (type == '6') {
            if (res.data.infos[index].avgreturnYear == "") {
              res.data.infos[index].yield = '--';
            } else {
              res.data.infos[index].yield = util.toFixNumber(res.data.infos[index].avgreturnYear, 2);
            }
          }
        }
        if (res.data.infos.length == 0) {
          that.setData({
            fundData: res.data.infos,
            winHeight: 270,
            showLoading: false,
            indexTab: e.target.dataset.index
          })
        } else {
          that.setData({
            fundData: res.data.infos,
            winHeight: res.data.infos.length * 53 + 30,
            showLoading: false,
            indexTab: e.target.dataset.index
          })
        }
      }
    })
  },
  /**
   * 基金详情
   */
  goToDetails: function (e) {
    var fundCode = e.currentTarget.dataset.code
    wx.navigateTo({
      url: '../fundDetails/fundDetails?fundCode=' + fundCode,
    })
  },
  /**
   * 下拉加载选择不同时间段
   */
  selectMore: function () {
    this.setData({
      openPicker: !this.data.openPicker,
      changeImg: !this.data.changeImg
    })
  }
})  