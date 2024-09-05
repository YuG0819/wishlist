// pages/shareappmessage/index.js
const app = getApp()
const Log = require('../../utils/log.js')
const shareApi = require('../../service/api/share.js')
const { TAG } = require('../../service/api/share.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TAG: "Page shareappmessage",
    Refuseshow: true,
    shareId: "",
    sharename: "",
    shareavatar: "",
    myopenid: "",
    show: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    let auth = wx.getStorageSync('auth')

    Log.debug(this.data.TAG, "onLoad shareId = " + options.shareId)
    Log.debug(this.data.TAG, "onLoad avatar = " + options.avatar)
    Log.debug(this.data.TAG, "onLoad nickName = " + options.name)
    this.setData({
      shareId: options.shareId,
      sharename: options.avatar,
      shareavatar: options.name
    })
  },
  async Confirm() {
    let auth = wx.getStorageSync('auth')
    Log.debug(this.data.TAG, "Confirm auth = " + JSON.stringify(auth))
    Log.debug(this.data.TAG, "Confirm shareId = " + this.data.shareId)
    if (auth.user._id == this.data.shareId) {
      Log.debug(this.data.TAG, "不能绑定自己")
      wx.reLaunch({
        url: '../home/index',
        success: function (res) { 
          Log.debug("this.data.TAG","success res = " + JSON.stringify(res))
        },
        fail: function (res) { 
          Log.error("this.data.TAG","fail res = " + JSON.stringify(res))
        },
      })
      return;
    }
    let param = {
      id: auth.user._id,
      bindId: this.data.shareId,
    }
    let res = await shareApi.bindLoving(param);
    Log.debug(this.data.TAG, "onLoad res = " + JSON.stringify(res))
    if (res.msg) {
      wx.reLaunch({
        url: '../home/index',
      })
    }

  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})