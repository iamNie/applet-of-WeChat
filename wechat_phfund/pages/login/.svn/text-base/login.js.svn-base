const app = getApp()
const util = require('../../utils/util.js');
var API_URL = util.API_URL
const md5 = require('../../utils/md5.js');
// const jsencrypt = require('../../utils/jsencrypt.js');
var loginType = [{
  "type": "手机",
  "idType": ''
}, {
  "type": "身份证",
  "idType": "0"
}, {
  "type": "中国护照",
  "idType": "1"
}, {
  "type": "军官证",
  "idType": "2"
}, {
  "type": "士兵证",
  "idType": "3"
}, {
  "type": "港澳台通行证",
  "idType": "4"
}, {
  "type": "外国护照",
  "idType": "6"
}, {
  "type": "户口本",
  "idType": "5"
}, {
  "type": "文职证",
  "idType": "8"
}, {
  "type": "警官证",
  "idType": "9"
}, {
  "type": "台胞证",
  "idType": "A"
}]
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openPicker: false,//默认显示手机
    loginType: "手机",
    changeImg: true,
    loginTypes: loginType,
    typeTab: "",
    textType: "idcard",
    userPwd: "",
    userName: "",
    changeEye: false,
    idType: "",
    showHide: true,
    flag: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync('loginType', "");
  },
  /**
   * 打开选择登录类型
   */
  selectType: function () {
    this.setData({
      openPicker: !this.data.openPicker,
      changeImg: !this.data.changeImg,
      showLoading: false
    })
  },
  /**
   * 选择登录类型
   */
  switchLoginType: function (e) {
    var type = e.currentTarget.dataset.type
    wx.setStorageSync('loginType', type);//存储登录类型
    this.setData({
      loginType: util.formatLoginType(type),
      showLoading: true,
      typeTab: e.currentTarget.dataset.type
    });
  },
  userNameInput: function (e) {
    this.setData({
      userName: e.detail.value
    })
  },
  passWdInput: function (e) {
    this.setData({
      userPwd: e.detail.value,
    })
  },
  /**
   * 密码显示与隐藏
   */
  showEye: function () {
    this.setData({
      textType: "text",
      showHide: !this.data.showHide
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
  },
  /**
   * 忘记密码
   */
  forgetPwd: function () {
    var that = this
    that.setData({
      retMsg: '请前往鹏华基金官方理财平台A加钱包进行密码找回~',
      flag: false
    })
  },
  /**
   * 登录
   */
  login: function () {
    var that = this
    var idType = wx.getStorageSync('loginType');//本地获取登录类型
    var idCode;
    var idtftp;//证件类型
    var idtfno;//证件号码
    var token;
    var loginName = this.data.userName;
    var loginPwd = this.data.userPwd;
    if (loginName == '') {
      that.setData({
        retMsg: '请输入登录账号',
        flag: false
      })
      return;
    }
    if (idType == '') {
      var a = util.checkMoblie2(loginName);
      if (!a) {
        that.setData({
          retMsg: '请输入正确的手机号~',
          flag: false
        })
        return;
      }
    }
    if (idType == '0') {
      var b = util.IdentityCodeValid(loginName);
      if (!b) {
        that.setData({
          retMsg: '请输入正确的身份证号码~',
          flag: false
        })
        return;
      }
    }
    if (loginPwd == '') {
      that.setData({
        retMsg: '请输入登录密码',
        flag: false
      })
      return;
    }
    if (loginPwd.length < 8 || loginPwd.length > 20) {
      that.setData({
        retMsg: '登录密码为8-20位字母+数字组成~',
        flag: false
      })
      return;
    }
    var r_p = util.RSAUtil(loginPwd);
    that.setData({
      showLoading: true
    })
    wx.setStorageSync('loginName', loginName); //存储用户名
    wx.setStorageSync('loginPwd', loginPwd);//存储密码
    wx.setStorageSync('idType', idType);//存储登录类型
    var sessionId = wx.getStorageSync("sessionId");
    if (util.isNull(sessionId)) {
      sessionId = util.timeStampFun() + 'abc';
      wx.setStorageSync('sessionId', sessionId);//存储登录类型
    }
    var signUrl = "loginName=" + loginName + "&idType=" + idType + "&loginPwd=" + r_p + "&deviceType=1&deviceId=shebeihaoshipc";//url配置
    var signKey = signUrl + "&key=abc123";//签名
    var sign = md5.hex_md5(signKey);//加密

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
          var sessionid = res.data.sessionId;
          token = res.data.token;
          wx.setStorageSync('g_token', res.data.token);
          wx.setStorageSync('g_cuatna', res.data.cuatna);
          wx.setStorageSync('g_lastTime', res.data.lastLoginTime);
          wx.setStorageSync('g_imagePhotoPath', res.data.imagePhotoPath);
          wx.setStorageSync('lastLoginTime', res.data.lastLoginTime);
          wx.setStorageSync('isLoginApp', res.data.isLoginApp);
          wx.setStorageSync('sessionId ', res.data.sessionId);
          wx.request({
            url: API_URL + 'wechat_qryUserInfo.tml?token=' + res.data.token + '&deviceId=shebeihaoshipc',
            header: {
              'content-type': 'application/json', // 默认值
              'branchCode': '04',
              'h-version': '8.0.0',
              'channelCode': '002001',
              'sessionId': sessionid
            },
            success: function (res) {
              if (res.data.respCode == '000000') {
                if (res.data.cuinfo.isauth == '1') {
                  that.setData({
                    showLoading: false,
                    retMsg: '请先前往鹏华基金A加钱包进行实名认证~',
                    flag: false
                  })
                  return;
                }
                var loginTime = Date.parse(new Date());
                wx.setStorageSync("loginTime", loginTime);
                wx.setStorageSync('isLogin', 1);//判断是否已经登录成功
                wx.setStorageSync('g_mobile', res.data.cuinfo.teleno);
                var activeFlag = res.data.cuinfo.activateFlag;
                var activeType = res.data.cuinfo.custSpecies;
                wx.setStorageSync('g_custac', res.data.cuinfo.custac);//交易帐号
                wx.setStorageSync('g_idtftp', res.data.cuinfo.idtftp);
                wx.setStorageSync('g_idcard', res.data.cuinfo.idtfno);
                idtftp = res.data.cuinfo.idtftp;
                idtfno = res.data.cuinfo.idtfno;

                wx.setStorageSync('g_activeType', res.data.cuinfo.custSpecies);
                wx.setStorageSync('isauth', res.data.cuinfo.isauth);
                wx.setStorageSync('risklv', res.data.cuinfo.risklv);

                wx.setStorageSync('riskLevelDesc ', res.data.cuinfo.riskLevelDesc);
                wx.setStorageSync('expireDate ', res.data.cuinfo.expireDate);

                //查询是否有代销资产 156-人民币 840--美元
                wx.request({
                  url: API_URL + 'affasset.tml?currencyType=156&idType=' + idtftp + '&idCode=' + idtfno + '&token=' + token + '&deviceId=shebeihaoshipc',
                  header: {
                    'content-type': 'application/json', // 默认值
                    'branchCode': '04',
                    'h-version': '8.0.0',
                    'channelCode': '002001',
                    'sessionId': sessionid
                  },
                  method: 'POST',
                  success: function (res) {
                    if (res.data.consignAssetsOut.length > 0) {
                      wx.switchTab({ //已经注册过的页面需要switchTab来跳转
                        url: '../aplusProperty/aplusProperty',
                      })
                    } else {
                      //查看是否有美元的代销资产存在
                      wx.request({
                        url: API_URL + 'affasset.tml?currencyType=840&idType=' + idtftp + '&idCode=' + idtfno + '&token=' + token + '&deviceId=shebeihaoshipc',
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
                            wx.switchTab({ //已经注册过的页面需要switchTab来跳转
                              url: '../aplusProperty/aplusProperty',
                             
                            })
                          } else {
                            //跳转到只有A+资产的页面
                            wx.switchTab({ //已经注册过的页面需要switchTab来跳转
                              url: '../aplusProperty/aplusProperty',
                            })
                          }
                        },
                      })
                    }
                  },
                })

                that.setData({
                  showLoading: false
                })
              }
            }
          })

        } else if (res.data.respCode == '0810010030') {
          that.setData({
            showLoading: false,
            retMsg: '您还未注册鹏华A加账户，请前往A加钱包APP进行注册~',
            flag: false
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
  },
  
  /**
   * 去验证代销账号
   */
  dxLogin:function(){
    wx.navigateTo({
      url: '../checkSaleAcct/checkSaleAcct',
    })
  }
})