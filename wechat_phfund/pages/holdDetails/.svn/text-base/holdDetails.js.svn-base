//fundDeatil.js 
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js');
var API_URL = util.API_URL
const md5 = require('../../utils/md5.js');

function login(that, options) {
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
                wx.request({
                  url: API_URL + "fundpositionsdatail.tml?token=" + g_token + "&deviceId=shebeihaoshipc&fundCode=" + options.fundCode + "&transAcctid=" + g_custac,
                  header: {
                    'content-type': 'application/json', // 默认值
                    'branchCode': '04',
                    'h-version': '8.0.0',
                    'channelCode': '002001',
                    'sessionId': sessionId
                  },
                  success: function (res) {
                    console.log(res.data)
                    res.data.nav = util.toFixNumber(res.data.nav, 4);
                    res.data.fundMarketValue = util.toThousands(res.data.fundMarketValue, 2);
                    res.data.yestodayPro = util.toThousands(res.data.yestodayPro, 2);
                    res.data.totlam = util.toThousands(res.data.totlam, 2);
                    res.data.holdShare = util.toThousands(res.data.holdShare, 2);
                    res.data.availableShare = util.toThousands(res.data.availableShare, 2);
                    that.setData({
                      holdDeatil: res.data,
                      showLoading: false
                    })
                  }
                })


              }
            }
          }
        })
      }else{
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
  data: {
    showLoading: true,//默认加载loading
    flag: true,
  },
  onLoad: function (options) {
    var that = this
    that.setData({
      fundCode: options.fundCode,
      showLoading: true
    });
    login(that, options)
    // var g_token = wx.getStorageSync("g_token");//获取token
    // var g_custac = wx.getStorageSync("g_custac");//获取交易账号
    // var sessionId = wx.getStorageSync("sessionId");//获取sessionId
    // wx.request({
    //   url: API_URL + "fundpositionsdatail.tml?token=" + g_token + "&deviceId=shebeihaoshipc&fundCode=" + options.fundCode + "&transAcctid=" + g_custac,
    //   header: {
    //     'content-type': 'application/json', // 默认值
    //     'branchCode': '02',
    //     'h-version': '8.0.0',
    //     'channelCode': '002001',
    //     'sessionId': sessionId
    //   },
    //   success: function (res) {
    //     console.log(res.data)
    //     res.data.nav = util.toFixNumber(res.data.nav, 4);
    //     res.data.fundMarketValue = util.toThousands(res.data.fundMarketValue, 2);
    //     res.data.yestodayPro = util.toThousands(res.data.yestodayPro,2);
    //     res.data.totlam = util.toThousands(res.data.totlam, 2);
    //     res.data.holdShare = util.toThousands(res.data.holdShare, 2);
    //     res.data.availableShare = util.toThousands(res.data.availableShare, 2);
    //     that.setData({
    //       holdDeatil: res.data,
    //       showLoading: false
    //     })
    //   }
    // })
  },
  /**
   * 查看基金经理信息
   */
  viewListManager: function (e) {
    var employeeNo = e.currentTarget.dataset.managerno;

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
   * 关闭弹框
   */
  powerDrawer: function () {
    var that = this
    that.setData({
      flag: true
    })
  }
})
