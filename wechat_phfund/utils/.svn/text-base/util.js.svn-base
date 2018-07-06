const md5 = require('md5.js')
var RSA = require('wx_rsa.js')
// var JSEncrypt = require('jsencrypt.js')
const API_URL = 'https://ishare.phfund.com.cn/preweb/'//灰度
// const API_URL = 'https://ishare.phfund.com.cn/wechattest/'//测试-顺丰环境
// const API_URL = 'https://phwealth.phfund.com.cn/corpweb-sit/'//测试
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  formatSortType: formatSortType,
  toFixNumber: toFixNumber,
  formatTime1: formatTime1,
  formatTime2: formatTime2,
  formatLoginType: formatLoginType,
  timeStampFun: timeStampFun,
  isNull: isNull,
  formatRisk: formatRisk,
  formatName: formatName,
  formatState: formatState,
  API_URL: API_URL,
  getBeforeDate: getBeforeDate,
  getNowDate: getNowDate,
  addDate: addDate,
  currentDate: currentDate,
  checkMoblie2:checkMoblie2,
  RSAUtil: RSAUtil,
  toThousands: toThousands,
  IdentityCodeValid: IdentityCodeValid
}
function RSAUtil(pwd) {
  var m_p = md5.hex_md5(pwd + 'phfund201606200001');
  var publicKey = "-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC9SOxr9Ob0wKWwE3hTNdl+Uk1PxnxDhtFK9Sl01bqSA4XHvH9s/yqCQT08F5feffnGbHyhRhojpx2jgaCGGZzm3zCF9AgPBdlIxhCXGb/cvcM5+9B6AdBWY5/imVCHmce1bAQ0os9fF0xbsRzGnhMHkfns2vI1mZjgDIMYq2vi3QIDAQAB-----END PUBLIC KEY-----";
  var encrypt_rsa = new RSA.RSAKey();
  encrypt_rsa = RSA.KEYUTIL.getKey(publicKey);

  var encStr = encrypt_rsa.encrypt(m_p)
  encStr = RSA.hex2b64(encStr);
  var r_p = encStr;
  return r_p;
}
/**
 * 校验手机号码
 */
function checkMoblie2(fieldValue) {
  if (!/^1[0-9]{10}$/i.test(fieldValue)) {
    return false;
  }
  return true;
}
/**
 * 校验身份证号码
 */
function certNoTrans18(certNo) {
  if (/^\d{15}$/i.test(certNo)) { //验证是否是15位
    var num = certNo;//身份证号码
    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
    var nTemp = 0;
    num = num.substr(0, 6) + '19' + num.substr(6, num.length - 6);
    for (var i = 0; i < 17; i++) {
      nTemp += num.substr(i, 1) * arrInt[i];
    }
    num = num + '' + arrCh[nTemp % 11];
    return num;
  } else {
    return certNo;
  }
}

function IdentityCodeValid(sId) {
  // var sId = $('#' + fieldId).val();

  sId = certNoTrans18(sId);

  sId = sId.toUpperCase();
  var pass = true;
  var aCity = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" }
  var iSum = 0;
  var info = "";
  if (!/^\d{17}(\d|x)$/i.test(sId)) {
    pass = false;
  }
  sId = sId.replace(/x$/i, "a");
  if (aCity[parseInt(sId.substr(0, 2))] == null) {
    pass = false;
  }
  var sBirthday = sId.substr(6, 4) + "-" + Number(sId.substr(10, 2)) + "-" + Number(sId.substr(12, 2));
  var d = new Date(sBirthday.replace(/-/g, "/"));
  if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())) {
    pass = false;
  }
  for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
  if (iSum % 11 != 1) {
    pass = false;
  }
  return pass;
}
/**
 * 金额格式化
 */
function toThousands(num, cent) {
  if (isNull(num)) {
    num = 0;
  }
  if (cent == 0) {
  }
  else if (isNull(cent)) {
    cent = 2;
  }
  num = parseFloat(num).toFixed(cent);
  var tempNum = num.toString();

  if (tempNum.indexOf('.') == -1) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
  } else {
    var numArr = num.toString().split('.');
    return (numArr[0] || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + '.' + numArr[1];
  }
}
//排序类型转换
function formatSortType(type) {
  if (type == '1') {
    return "日涨幅"
  } else if (type == '2') {
    return '近一周'
  } else if (type == '3') {
    return '近一月'
  } else if (type == '4') {
    return '近三月'
  } else if (type == '5') {
    return '近六月'
  } else if (type == '6') {
    return '近六月'
  } else if (type == '9') {
    return '七日年化'
  } else {
    return '今年来'
  }
}

/**
 * 计算加减 days-加减天数
 */
function addDate(date, days) {
  date = date.replace(/-/g, "/");
  var d = new Date(date);
  d.setDate(d.getDate() + days);
  var m = d.getMonth() + 1;
  var day = d.getDate();
  if (Number(m) < 10) {
    m = '0' + m;
  }
  if (Number(day) < 10) {
    day = '0' + day;
  }
  return d.getFullYear() + '' + m + '' + day;
}
/**
 * 获取当前日期
 */
function currentDate() {
  var nowdate = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = nowdate.getMonth() + 1;
  var strDate = nowdate.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  return nowdate.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + nowdate.getHours() + seperator2 + nowdate.getMinutes()
    + seperator2 + nowdate.getSeconds();
}
//获取当前日期前七天
function getBeforeDate(n) {
  var d = new Date();
  var year = d.getFullYear();
  var mon = d.getMonth() + 1;
  var day = d.getDate();
  if (day <= n) {
    if (mon > 1) {
      mon = mon - 1;
    }
    else {
      year = year - 1;
      mon = 12;
    }
  }
  d.setDate(d.getDate() - n);
  year = d.getFullYear();
  mon = d.getMonth() + 1;
  day = d.getDate();
  var s = year + (mon < 10 ? ('0' + mon) : mon) + (day < 10 ? ('0' + day) : day);
  return s;
}
//获取当前日期
function getNowDate() {
  var d = new Date();
  var y = d.getFullYear();
  var m = d.getMonth() + 1;
  var dd = d.getDate();

  if (Number(m) < 10) {
    m = '0' + m;
  }
  if (Number(dd) < 10) {
    dd = '0' + dd;
  }

  return y + '' + m + '' + dd;
}


//格式化
function toFixNumber(x, y) {
  if (x == '0' || x == '0.0000') {
    return '0.00'
  }
  var f = parseFloat(x);
  if (isNaN(f)) {
    return false;
  }
  var z = 1;
  for (var i = 0; i < y; i++) {
    z *= 10;
  }
  var f = Math.round(x * z) / z;
  var s = f.toString();
  var rs = s.indexOf('.');
  if (rs < 0) {
    rs = s.length;
    s += '.';
  }
  while (s.length <= rs + y) {
    s += '0';
  }
  return s;
}

function formatTime1(timeStr) {
  if (timeStr.length == 14) {
    return timeStr.substring(0, 4) + "-" + timeStr.substring(4, 6) + "-" + timeStr.substring(6, 8) + " " + timeStr.substring(8, 10) + ":" + timeStr.substring(10, 12) + ":" + timeStr.substring(12, 14);
  } else if (timeStr.length == 8) {
    return timeStr.substring(0, 4) + "-" + timeStr.substring(4, 6) + "-" + timeStr.substring(6, 8);
  } else if (timeStr.length == 6) {
    return timeStr.substring(0, 2) + ":" + timeStr.substring(2, 4) + ":" + timeStr.substring(4, 6);
  } else {
    return "";
  }
}

function formatTime2(timeStr) {
  if (timeStr == null || timeStr == "") {
    return "";
  }
  return timeStr.replace(/-/g, "").replace(/:/g, "").replace(" ", "");
}

/**
 * 登录类型转换
 */
function formatLoginType(idType) {
  if (idType == '') {
    return '手机'
  } else if (idType == '0') {
    return '身份证'
  } else if (idType == '2') {
    return '军官证'
  } else if (idType == '3') {
    return '士兵证'
  } else if (idType == '4') {
    return '港澳通行证'
  } else if (idType == '1') {
    return '中国护照'
  } else if (idType == '6') {
    return '外国护照'
  } else if (idType == '5') {
    return '户口本'
  } else if (idType == '8') {
    return '文职证'
  } else if (idType == '9') {
    return '警官证'
  } else {
    return '台胞证'
  }
}

/**
 * 时间戳方法
 * @returns {*}
 */
function timeStampFun() {
  var timeStamp = (new Date()).valueOf();
  return timeStamp;
}

/**
 * 判断数值是否为空
 * @param str    判断的值
 * @param inputId: 可选参数，    input框id，此处是为了处理对于不支持placeholder的input的框，判断为空时会将placeholder的值当做非空
 * @returns
 */
function isNull(str, inputId) {
  if (inputId === "null" || inputId === null || typeof (inputId) === "undefined" || inputId === undefined || inputId === "") {
    return (str === "null" || str === null || typeof (str) === "undefined" || str === undefined || str === "");
  }
  return (str === "null" || str === null || typeof (str) === "undefined" || str === undefined || str === "" || str === $('#' + inputId).attr('placeholder'));
}

/**
 * 基金类型转换
 */
//ALL - 全部 00 - 已关注 01 - 股票型 02 - 债券型 03 - 混合型 04 - 货币型 05 - QDII基金 06 - 封闭型基金 07 - ETF基金 08 - 专户产品 09 - 指数型基金

function formatName(fundType) {
  if (fundType == '00') {
    return '已关注'
  } else if (fundType == '01') {
    return '股票型'
  } else if (fundType == '02') {
    return '债券型'
  } else if (fundType == '03') {
    return '混合型'
  } else if (fundType == '04') {
    return '货币型'
  } else if (fundType == '05') {
    return 'QDII基金'
  } else if (fundType == '06') {
    return '封闭型基金'
  } else if (fundType == '07') {
    return 'ETF基金'
  } else if (fundType == '08') {
    return '专户产品'
  } else if (fundType == '09') {
    return '指数型基金'
  }
}
/**
 * 风险转换
 */
function formatRisk(acctRisk) {
  if (acctRisk == '0') {
    return '低风险'
  } else if (acctRisk == '1') {
    return '中低风险'
  } else if (acctRisk == '2') {
    return '中风险'
  } else if (acctRisk == '3') {
    return '中高风险'
  } else {
    return '高风险'
  }
}

/**
 * 风险转换'0': '开放申/赎',
    '1': '开放认购',
    '2': '未开放申/赎',
    '3': '未开放申/赎',
    '4': '未开放申/赎',
    '5': '停止申购',
    '6': '停止赎回',
    '7': '开放申/赎',
    '8': '开放申/赎',
    '9': '未开放申/赎',
    'a': '未开放申/赎',
    'b': '预约认购',
    'c': '预约申购'
 */
function formatState(tsrState) {
  if (tsrState == '0') {
    return '开放申/赎'
  } else if (tsrState == '1') {
    return '开放认购'
  } else if (tsrState == '2' || tsrState == '4' || tsrState == '3' || tsrState == '9' || tsrState == 'a') {
    return '未开放申/赎'
  } else if (tsrState == '5') {
    return '停止申购'
  } else if (tsrState == '6') {
    return '停止赎回'
  } else if (tsrState == '7' || tsrState == '8') {
    return '开放申/赎'
  } else if (tsrState == 'b') {
    return '预约认购'
  } else if (tsrState == 'c') {
    return '预约申购'
  } else {

  }
}