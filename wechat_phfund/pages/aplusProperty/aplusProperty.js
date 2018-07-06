//aplusProperty.js
const app = getApp()
const util = require('../../utils/util.js');
var API_URL = util.API_URL
const md5 = require('../../utils/md5.js');
var time = 1;
var total1 = 0;
var total2 = 0;
var aplusAsset1 = 0;//A加总资产
var height = 0;
var tranInFound = 0;//在途资产
function login(that) {
  var idtftp = '';//证件类型
  var idtfno = '';//证件号码
  var loginName = wx.getStorageSync("loginName");//获取用户名
  var loginPwd = wx.getStorageSync("loginPwd");//获取密码
  var idType = wx.getStorageSync("loginType");//获取登录类型
  var r_p = util.RSAUtil(loginPwd);
  var signUrl = "loginName=" + loginName + "&idType=" + idType + "&loginPwd=" + r_p + "&deviceType=1&deviceId=shebeihaoshipc";//url配置
  var signKey = signUrl + "&key=abc123";//签名
  var sign = md5.hex_md5(signKey);//加密
  var sessionId1;
  var sessionId = '';
  if (util.isNull(sessionId)) {
    sessionId = util.timeStampFun() + 'abc';
    wx.setStorageSync('sessionId', sessionId);//存储登录类型
  }
  wx.request({
    url: API_URL + "wechatlogin.tml?" + signUrl + "&sign=" + sign + "",
    header: {
      'content-type': 'application/json', // 默认值
      'branchCode': '04',
      'h-version': '8.0.0',
      'channelCode': '002001',
      'sessionId': sessionId
    },
    success: function (res) {
      if (res.data.respCode == '000000') {
        var sessionId1 = res.data.sessionId;
        wx.setStorageSync("sessionId2", res.data.sessionId)
        wx.setStorageSync("token1", res.data.token)
        var g_token = res.data.token;

        wx.request({
          url: API_URL + 'wechat_qryUserInfo.tml?token=' + res.data.token + '&deviceId=shebeihaoshipc',
          header: {
            'content-type': 'application/json', // 默认值
            'branchCode': '04',
            'h-version': '8.0.0',
            'channelCode': '002001',
            'sessionId': sessionId1
          },
          success: function (res) {
            if (res.data.respCode == '000000') {
              wx.setStorageSync("idtftp", res.data.cuinfo.idtftp)
              wx.setStorageSync("idtfno", res.data.cuinfo.idtfno)
              idtftp = res.data.cuinfo.idtftp;
              idtfno = res.data.cuinfo.idtfno;
              var startd = util.getBeforeDate(7);// 起始时间
              var enddat = util.getNowDate();// 截止时间
              var incodt = util.getNowDate();// 收益时间
              if (sessionId1 == undefined) {
                return;
              } else {
                var g_custac = wx.getStorageSync("g_custac");//获取交易账号
                var fundTotlam;//基金资产累计收益
                var fundYestodayPro;//基金资产昨日收益
                var walletYesrev;//钱包昨日收益
                var walletTotalr;//钱包累计收益
                //查基金资产信息（只包含钱基金资产的信息--余额、昨日、累计）
                wx.request({
                  url: API_URL + 'fundassetinformation.tml?token=' + g_token + '&deviceId=shebeihaoshipc&transAcctid=' + g_custac,
                  header: {
                    'content-type': 'application/json', // 默认值
                    'branchCode': '04',
                    'h-version': '8.0.0',
                    'channelCode': '002001',
                    'sessionId': sessionId1
                  },
                  method: "POST",
                  success: function (res) {
                    fundTotlam = res.data.totlam;
                    fundYestodayPro = res.data.yestodayPro
                  },
                })

                //查钱包信息（只包含钱包的信息--余额、昨日、累计）
                wx.request({
                  url: API_URL + 'qryWalletInfo.tml?startd=' + startd + '&enddat=' + enddat + '&incodt=' + incodt + '&chantp=1&token=' + g_token + '&deviceId=shebeihaoshipc&transAcctid=' + g_custac + "&sign=971fa2ca1db70fa637aefcf330543157",
                  data: {
                    token: g_token,
                    deviceId: 'shebeihaoshipc',
                    sign: '971fa2ca1db70fa637aefcf330543157'
                  },
                  header: {
                    'content-type': 'application/json', // 默认值
                    'content-type': 'application/json', // 默认值
                    'branchCode': '04',
                    'h-version': '8.0.0',
                    'channelCode': '002001',
                    'sessionId': sessionId1
                  },
                  success: function (res) {
                    if (res.data.respCode == '000000') {
                      var wekyie = util.toFixNumber((res.data.walout.wyield[res.data.walout.wyield.length - 1].wekyie) * 100, 4) + "%";//七日
                      walletYesrev = res.data.walout.yesrev;//昨日
                      walletTotalr = res.data.walout.totalr;//累计
                      var walamt = util.toThousands(res.data.walout.walamt, 2);//余额
                      that.setData({
                        wyield: wekyie,
                        walamt: walamt,
                        walletYesrev: util.toFixNumber(walletYesrev, 2),
                        walletTotalr: util.toFixNumber(walletTotalr, 2)
                      })
                    } else {
                      that.setData({
                        showLoading: false,
                        retMsg: res.data.respMsg,
                        flag: false
                      })
                    }
                  }
                })

                //查总资产--就一个总金额
                wx.request({
                  url: API_URL + 'assetinformation.tml?token=' + g_token + '&deviceId=shebeihaoshipc&transAcctid=' + g_custac,
                  header: {
                    'content-type': 'application/json', // 默认值
                    'branchCode': '04',
                    'h-version': '8.0.0',
                    'channelCode': '002001',
                    'sessionId': sessionId1
                  },
                  method: "POST",
                  success: function (res) {
                    if (res.data.respCode == '000000') {
                      var yestodayPro = util.toFixNumber(fundYestodayPro + walletYesrev, 2);
                      aplusAsset1 = res.data.sumamt;
                      total1 = res.data.sumamt;
                      tranInFound = res.data.tranInFound;
                      that.setData({
                        sumamt1: res.data.sumamt,
                        aplusAsset: util.toThousands(res.data.sumamt, 2),//总金额
                        totlam: util.toFixNumber(fundTotlam + walletTotalr, 2),//总的累计收益
                        yestodayPro: yestodayPro,//总的昨日收益
                        sumamt: util.toThousands((total2 + total1), 2),
                        tranInFound: tranInFound
                      })
                    } else {
                      that.setData({
                        showLoading: false,
                        retMsg: res.data.respMsg,
                        flag: false
                      })
                    }

                  },
                })
                //查询钱包对应的基金代码和基金名称
                var personalFundCode;
                var personalFundName;
                wx.request({
                  url: API_URL + 'qrywalletfundcode.tml?token=' + g_token + '&deviceId=shebeihaoshipc',
                  header: {
                    'content-type': 'application/json', // 默认值
                    'branchCode': '04',
                    'h-version': '8.0.0',
                    'channelCode': '002001',
                    'sessionId': sessionId1
                  },
                  method: "POST",
                  success: function (res) {
                    if (res.data.respCode == '000000') {
                      personalFundName = res.data.personalFundName;
                      personalFundCode = res.data.personalFundCode;//钱包

                      //查询持仓列表
                      wx.request({
                        url: API_URL + 'fundpositionslist.tml?token=' + g_token + '&deviceId=shebeihaoshipc&playFlg=1&pageno=1&pagesz=99&transAcctid=' + g_custac,
                        header: {
                          'content-type': 'application/json', // 默认值
                          'branchCode': '04',
                          'h-version': '8.0.0',
                          'channelCode': '002001',
                          'sessionId': sessionId1
                        },
                        method: "POST",
                        success: function (res) {
                          var array = [];
                          for (var index in res.data.funds) {
                            if (res.data.funds[index].fundCode !== personalFundCode) {
                              res.data.funds[index].yestodayPro = util.toFixNumber(res.data.funds[index].yestodayPro, 2);
                              res.data.funds[index].totlam = util.toFixNumber(res.data.funds[index].totlam, 2);
                              res.data.funds[index].assertMarketValue = util.toThousands(res.data.funds[index].assertMarketValue, 2);
                              array.push(res.data.funds[index]);
                            }
                          }
                          if (array.length * 70 + 8 + 114 + 43 + 180 < height) {
                            that.setData({
                              heightLength: height - 305 + 'px',
                            })
                          } else {
                            that.setData({
                              heightLength: '100%',
                            })
                          }
                          that.setData({
                            fundList: array,
                            personalFundCode: personalFundCode,
                            showLoading: false
                          })
                        }
                      })
                    } else {
                      that.setData({
                        showLoading: false,
                        retMsg: res.data.respMsg,
                        flag: false
                      })
                    }

                  },
                })
                //查询是否有代销资产 156-人民币 840--美元
                wx.request({
                  url: API_URL + 'affasset.tml?currencyType=156&idType=' + idtftp + '&idCode=' + idtfno + '&token=' + g_token + '&deviceId=shebeihaoshipc',
                  header: {
                    'content-type': 'application/json', // 默认值
                    'branchCode': '04',
                    'h-version': '8.0.0',
                    'channelCode': '002001',
                    'sessionId': sessionId1
                  },
                  method: 'POST',
                  success: function (res) {
                    if (res.data.respCode == '000000') {
                      if (res.data.consignAssetsOut.length > 0) {
                        var totalPrice = 0;
                        for (var index in res.data.consignAssetsOut) {
                          totalPrice += res.data.consignAssetsOut[index].totalPrice;
                          res.data.consignAssetsOut[index].totalPrice = util.toThousands(res.data.consignAssetsOut[index].totalPrice, 2)
                          for (var i in res.data.consignAssetsOut[index].fundShareList) {
                            res.data.consignAssetsOut[index].fundShareList[i].totalShare = util.toThousands(res.data.consignAssetsOut[index].fundShareList[i].totalShare, 2);
                            res.data.consignAssetsOut[index].fundShareList[i].totalPrice = util.toThousands(res.data.consignAssetsOut[index].fundShareList[i].totalPrice, 2)
                          }
                        }

                        total2 = totalPrice;
                        that.setData({
                          showAplus: true,
                          showAll: false,
                          sellsAsset: res.data.consignAssetsOut,
                          totalPrice: util.toThousands(totalPrice, 2),
                          sumamt: util.toThousands((total2 + total1), 2),
                        })
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
                              that.setData({
                                showImg: false
                              })
                            } else {
                              that.setData({
                                showImg: true
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
                                res.data.consignAssetsOut[index].totalPrice = util.toThousands(res.data.consignAssetsOut[index].totalPrice, 2)
                                for (var i in res.data.consignAssetsOut[index].fundShareList) {
                                  res.data.consignAssetsOut[index].fundShareList[i].totalShare = util.toThousands(res.data.consignAssetsOut[index].fundShareList[i].totalShare, 2);
                                  res.data.consignAssetsOut[index].fundShareList[i].totalPrice = util.toThousands(res.data.consignAssetsOut[index].fundShareList[i].totalPrice, 2)
                                }
                              }
                              that.setData({
                                showAplus: true,
                                showAll: false,
                                sellsAsset: res.data.consignAssetsOut,
                                totalPrice: totalPrice,
                                onlyDollar: 1,
                                sumamt: totalPrice,
                                showImg: false
                              })
                            } else {
                              that.setData({
                                showAplus: false,
                                showAll: true,
                                onlyDollar: 0,
                                showImg: true
                              })
                            }
                          },
                        })
                      }
                    }
                  },
                })
              }
            } else {
              that.setData({
                showLoading: false,
                retMsg: res.data.respMsg,
                flag: false
              })
            }
          }
        })
      } else {
        that.setData({
          showLoading: false,
          retMsg: res.data.respMsg,
          flag: false
        })
      }


    }
  })
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hideOut: true,
    showAplus: true,
    showAll: true,
    currentTab: "01",
    showImg: true,
    unit: '元',
    openPicker: false,//默认关闭选择
    totalzc: "人民币总资产",
    totaldx: "人民币代销总资产",
    flag: true,//默认关闭弹框
    showZichan: true,
    hidezc: false,
    showSellAssets: false,
    showRmbAssets: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      hideOut: false,
      showLoading: true,
      // showSellAssets: true
    })
    wx.hideShareMenu()//关闭转发按钮
  },
  /**
   * 切换资产
   */
  swtichAsset: function (e) {
    var that = this
    var current = e.currentTarget.dataset.current

    that.setData({
      currentTab: e.currentTarget.dataset.current
    })
  },
  goToDetails: function (e) {
    var fundCode = e.currentTarget.dataset.code
    wx.navigateTo({
      url: '../fundDetails/fundDetails?fundCode=' + fundCode,
    })
  },
  /**
   * 安全退出
   */
  loginOut: function () {
    wx.clearStorageSync("isLogin", "");
    var that = this
    //当退出的时候进行资产归位，只展示A加资产
    that.setData({
      showAll: true,
      showAplus: false
    })
    wx.navigateTo({
      url: '../login/login',
    })
  },
  /**
   * 查看持有详情
   */
  goToHoldDetails: function (e) {
    var fundCode = e.currentTarget.dataset.code
    wx.navigateTo({
      url: '../holdDetails/holdDetails?fundCode=' + fundCode,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var that = this
    var showAsset = wx.getStorageSync("showAsset");
    if (showAsset == '1') {
      that.setData({
        showRmbAssets: false,
        showZichan: false,
      })
      var sessionId = util.timeStampFun() + 'abc';
      var idCode = wx.getStorageSync("identify");
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
          if (res.data.respCode == '000000') {
            if (res.data.consignAssetsOut.length > 0) {
              var totalPrice = 0;
              for (var index in res.data.consignAssetsOut) {
                totalPrice += res.data.consignAssetsOut[index].totalPrice;
                res.data.consignAssetsOut[index].totalPrice = util.toThousands(res.data.consignAssetsOut[index].totalPrice, 2)
                for (var i in res.data.consignAssetsOut[index].fundShareList) {
                  res.data.consignAssetsOut[index].fundShareList[i].totalShare = util.toThousands(res.data.consignAssetsOut[index].fundShareList[i].totalShare, 2);
                  res.data.consignAssetsOut[index].fundShareList[i].totalPrice = util.toThousands(res.data.consignAssetsOut[index].fundShareList[i].totalPrice, 2)
                }
              }
              that.setData({
                showAplus: true,
                showAll: false,
                sellsAsset: res.data.consignAssetsOut,
                sumamt: util.toThousands(totalPrice, 2),
                showMore: false
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
                      showLoading: false,
                      showSellAssets: true
                    })
                  } else {
                    that.setData({
                      showImg: true,
                      showLoading: false,
                      showSellAssets: true
                    })
                  }
                },
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
                      res.data.consignAssetsOut[index].totalPrice = util.toThousands(res.data.consignAssetsOut[index].totalPrice, 2)
                      for (var i in res.data.consignAssetsOut[index].fundShareList) {
                        res.data.consignAssetsOut[index].fundShareList[i].totalShare = util.toThousands(res.data.consignAssetsOut[index].fundShareList[i].totalShare, 2);
                        res.data.consignAssetsOut[index].fundShareList[i].totalPrice = util.toThousands(res.data.consignAssetsOut[index].fundShareList[i].totalPrice, 2)
                      }
                    }
                    that.setData({
                      showAplus: true,
                      showAll: false,
                      sellsAsset: res.data.consignAssetsOut,
                      totaldx: "美元代销资产",
                      unit: "(美元)",
                      sumamt: util.toThousands(totalPrice, 2),
                      showImg: true,
                      showSellAssets: true,
                      showLoading: false,
                    })
                  } else {
                    that.setData({
                      showAplus: false,
                      showAll: true,
                      // onlyDollar: 0,
                      showImg: true,
                      showSellAssets: true,
                      showLoading: false
                    })
                  }
                },
              })
            }
          }
        },
      })
      // wx.setStorageSync('showAsset', '');
      return;
    }
    // wx.getSystemInfo({
    //   success: function (res) {
    //     height = res.windowHeight
    //   }
    // });
    that.setData({
      showZichan: true,
      showSellAssets: false,
    })
    var nowTime = Date.parse(new Date());
    var loginTime = wx.getStorageSync("loginTime");
    if (loginTime != '') {
      if (15 * 24 * 60 * 60000 < (nowTime - loginTime)) {
        wx.clearStorageSync("isLogin", "");
      }
    }
    var isLogin = wx.getStorageSync("isLogin");
    //是否已经登录
    if (isLogin == '1') {
      login(that);
      that.setData({
        hideOut: false,
        unit: '元',
        totalzc: '人民币总资产',
        showZichan: false,
        showRmbAssets: true
      })
    } else {
      that.setData({
        fundList: "",
        sumamt: '----',
        yestodayPro: "----",
        totlam: '----',
        wyield: '0.00',
        walamt: "",
        walletYesrev: '',
        walletTotalr: '',
        hideOut: true
      })
      //如果是代销资产查看更多基金返回的时候还是返回到我的资产页面
      var assetFund = wx.getStorageSync('assetFund');
      if (assetFund != '') {
        wx.clearStorageSync('assetFund', '');
        return;
      }
      //如果是第一次进来页面
      if (time == '1') {
        wx.navigateTo({
          url: '../login/login',
        })
        time++;
      } else {
        wx.switchTab({
          url: '../index/index',
        })
        time = 1;
      }
    }
  },
  /**切换代销资产 */
  changeType1: function (e) {
    var that = this
    var sessionId = util.timeStampFun() + 'abc';
    var idCode = wx.getStorageSync("identify");
    var index = e.currentTarget.dataset.index;
    that.setData({
      showLoading: false
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
              res.data.consignAssetsOut[index].totalPrice = util.toThousands(res.data.consignAssetsOut[index].totalPrice, 2)
              for (var i in res.data.consignAssetsOut[index].fundShareList) {
                res.data.consignAssetsOut[index].fundShareList[i].totalShare = util.toThousands(res.data.consignAssetsOut[index].fundShareList[i].totalShare, 2);
                res.data.consignAssetsOut[index].fundShareList[i].totalPrice = util.toThousands(res.data.consignAssetsOut[index].fundShareList[i].totalPrice, 2)
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
            that.setData({
              showAplus: true,
              showAll: false,
              sellsAsset: '',
              sumamt: '',
              showLoading: false
            })
          }
        }
      })
      that.setData({
        unit: '元',
        totaldx: '人民币代销资产',
        openPicker: false,
        // showLoading: false,
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
              res.data.consignAssetsOut[index].totalPrice = util.toThousands(res.data.consignAssetsOut[index].totalPrice, 2)
              for (var i in res.data.consignAssetsOut[index].fundShareList) {
                res.data.consignAssetsOut[index].fundShareList[i].totalShare = util.toThousands(res.data.consignAssetsOut[index].fundShareList[i].totalShare, 2);
                res.data.consignAssetsOut[index].fundShareList[i].totalPrice = util.toThousands(res.data.consignAssetsOut[index].fundShareList[i].totalPrice, 2)
              }
            }
            that.setData({
              sellsAsset: res.data.consignAssetsOut,
              sumamt: util.toThousands(totalPrice, 2),
              showLoading: false
            })
          } else {
            that.setData({
              sellsAsset: '',
              sumamt: '',
              showLoading: false
            })
          }
        },
      })
      that.setData({
        unit: '美元',
        totaldx: "美元代销资产",
        openPicker: false,
        // showLoading: false,
      })
    }
  },
  /**查看更多基金 */
  viewFundDetail: function () {
    wx.navigateTo({
      url: '../fundShop/fundShop',
    })
    wx.setStorageSync('assetFund', 1)
  },
  /**
    * 关闭弹框
    */
  powerDrawer: function () {
    var that = this
    that.setData({
      flag: true
    })
  },
  /**
   * 切换人民币或者美元
   */
  changeType: function (e) {
    var that = this
    var idtftp = wx.getStorageSync("idtftp");//证件类型
    var idtfno = wx.getStorageSync("idtfno");//证件号码
    var sessionId2 = wx.getStorageSync("sessionId2");//session
    var token1 = wx.getStorageSync("token1");
    var index = e.currentTarget.dataset.index;
    if (index == '156') {
      wx.request({
        url: API_URL + 'affasset.tml?currencyType=156&idType=' + idtftp + '&idCode=' + idtfno + '&token=' + token1 + '&deviceId=shebeihaoshipc',
        header: {
          'content-type': 'application/json', // 默认值
          'branchCode': '04',
          'h-version': '8.0.0',
          'channelCode': '002001',
          'sessionId': sessionId2
        },
        method: 'POST',
        success: function (res) {
          if (res.data.consignAssetsOut.length > 0) {
            var totalPrice = 0;
            for (var index in res.data.consignAssetsOut) {
              totalPrice += res.data.consignAssetsOut[index].totalPrice;
              res.data.consignAssetsOut[index].totalPrice = util.toThousands(res.data.consignAssetsOut[index].totalPrice, 2)
              for (var i in res.data.consignAssetsOut[index].fundShareList) {
                res.data.consignAssetsOut[index].fundShareList[i].totalShare = util.toThousands(res.data.consignAssetsOut[index].fundShareList[i].totalShare, 2);
                res.data.consignAssetsOut[index].fundShareList[i].totalPrice = util.toThousands(res.data.consignAssetsOut[index].fundShareList[i].totalPrice, 2)
              }
            }
            total2 = totalPrice;
            that.setData({
              showAplus: true,
              showAll: false,
              sellsAsset: res.data.consignAssetsOut,
              totalPrice: util.toThousands(totalPrice, 2),
              sumamt: util.toThousands((total2 + total1), 2),
              showLoading: false
            })
          } else {
            that.setData({
              showLoading: false
            })
          }
        }
      })
      that.setData({
        unit: '元',
        totalzc: '人民币总资产',
        openPicker: false,
        showLoading: true,
        hidezc: false,
        aplusAsset: util.toThousands(aplusAsset1, 2),
        tranInFound: tranInFound
      })
    } else {
      wx.request({
        url: API_URL + 'affasset.tml?currencyType=840&idType=' + idtftp + '&idCode=' + idtfno + '&token=' + token1 + '&deviceId=shebeihaoshipc',
        header: {
          'content-type': 'application/json', // 默认值
          'branchCode': '04',
          'h-version': '8.0.0',
          'channelCode': '002001',
          'sessionId': sessionId2
        },
        method: 'POST',
        success: function (res) {

          if (res.data.consignAssetsOut.length > 0) {
            var totalPrice = 0;
            for (var index in res.data.consignAssetsOut) {
              totalPrice += res.data.consignAssetsOut[index].totalPrice;
              res.data.consignAssetsOut[index].totalPrice = util.toThousands(res.data.consignAssetsOut[index].totalPrice, 2)
              for (var i in res.data.consignAssetsOut[index].fundShareList) {
                res.data.consignAssetsOut[index].fundShareList[i].totalShare = util.toThousands(res.data.consignAssetsOut[index].fundShareList[i].totalShare, 2);
                res.data.consignAssetsOut[index].fundShareList[i].totalPrice = util.toThousands(res.data.consignAssetsOut[index].fundShareList[i].totalPrice, 2)
              }
            }
            that.setData({
              showAplus: true,
              showAll: false,
              sellsAsset: res.data.consignAssetsOut,
              totalPrice: util.toThousands(totalPrice, 2),
              onlyDollar: 1,
              sumamt: util.toThousands(totalPrice, 2),
              showLoading: false
            })
          } else {
            that.setData({
              showAplus: false,
              showAll: true,
              onlyDollar: 0,
              showLoading: false
            })
          }
        },
      })
      that.setData({
        unit: '美元',
        totalzc: '美元总资产',
        openPicker: false,
        showLoading: true,
        hidezc: true,
        aplusAsset: "0.00",
        tranInFound: 0
      })
    }
  },
  /**
   * 切换
   */
  switch: function () {
    var that = this
    that.setData({
      openPicker: !this.data.openPicker,
    })
  }
})