const md5 = require('md5.js')
const util = require('util.js');
var API_URL = util.API_URL

module.exports = {
  login: login
}

function login(){

  var loginName = wx.getStorageSync("loginName");//获取用户名
  var loginPwd = wx.getStorageSync("loginPwd");//获取密码
  console.log('common run login------- ' + loginName + "=" + loginPwd);
  var idType = wx.getStorageSync("idType");//获取登录类型

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
      sessionId1 = res.data.sessionId;
      console.log("-------common login succ----" + sessionId1);
      return sessionId1;
    },
    complete:function(res){
      console.log('--------common login complete------')
    }
  })
  console.log('=======common login wx.request=======')
}
