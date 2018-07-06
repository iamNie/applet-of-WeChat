// pages/checkSuccess/checkSuccess.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  next:function(){
    wx.setStorageSync('showAsset', 1);
    wx.switchTab({
      url: '../aplusProperty/aplusProperty',
    })
  }
})