// pages/home/index.js
const rememberApi = require("../../service/api/remember")
const authApi = require('../../service/api/auth.js')
const Log = require('../../utils/log.js')
const commonApi = require("../../service/api/common.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TAG: "Page home",
    auth: wx.getStorageSync('auth'),
    isBind: true,
    together: '',
    count: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.checkBind()
    this.getCount()
    this.getTogether()
  },

  /**
   * 判断有没有绑定恋爱关系
   */
  async checkBind() {
    Log.debug(this.data.TAG, "checkBind")
    let res = await authApi.checkBindInfo()
    Log.debug(this.data.TAG, "res = " + JSON.stringify(res))

    wx.setStorageSync('auth', res)
    if (!res.user.bindId) {
      this.setData({
        isBind: false
      })
    } else {
      this.setData({
        auth: wx.getStorageSync('auth')
      })
    }
    Log.debug(this.data.TAG, "auth = " + JSON.stringify(this.data.auth))
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
    Log.debug(this.data.TAG, "onPullDownRefresh")
    this.checkBind()
    this.getCount()
    this.getTogether()
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
    const current_auth = this.data.auth

    Log.debug(this.data.TAG, "onShareAppMessage auth = " + JSON.stringify(current_auth))

    return {
      title: `${current_auth.user.nickName}邀请你加入情侣空间`,
      path: `pages/shareappmessage/index?shareId=${current_auth.user._id}&avatar=${current_auth.user.avatarUrl}&name=${current_auth.user.nickName}`,
      imageUrl: "../../image/398f0452-72bd-4928-a1f3-b64ce425f2a9.png"
    }

  },
  //获取在一起的天数
  async getTogether() {
    let param = {
      id:this.data.auth.user._id,
      bindId:this.data.auth.user.bindId,
    }
    let res = await rememberApi.together(param);
    this.setData({
      together:res || '???'
    })
  },
  goRemember() {
    Log.info(this.data.TAG, "goRemember")
    if (!this.data.isBind) {
      wx.showToast({
        title: '请先绑定另一半哦',
        icon: 'none',
        duration: 1000
      })
      return
    }
    wx.navigateTo({
      url: `../remember/index`,
    })
  },
  goTodo() {
    Log.info(this.data.TAG, "goTodo")
    if (!this.data.isBind) {
      wx.showToast({
        title: '请先绑定另一半哦',
        icon: 'none',
        duration: 1000
      })
      return
    }
    wx.navigateTo({
      url: `../todo/index`,
    })
  },
  goPhoto() {
    console.log("goPhoto");
    wx.showToast({
      title: '相册功能待开发。。。',
      icon: 'loading',
      duration: 2000
    })
  },
  goTravel() {
    console.log("goTravel");
    wx.showToast({
      title: '旅行功能待开发。。。',
      icon: 'loading',
      duration: 2000
    })
  },
  /**
   * 用户getcount
   */
  async getCount() {
    let param = {
      id:this.data.auth.user._id,
      bindId:this.data.auth.user.bindId,
    }
    let res = await commonApi.getCount(param)
    console.log("pages/home res = " + JSON.stringify(res))
    this.setData({
      count: res
    })
    wx.stopPullDownRefresh()
  },

  async getTodo() {
    Log.debug(this.data.TAG, "getTodo ")
    const auth = wx.getStorageSync('auth')
    Log.debug(this.data.TAG, "getTodo auth = " + JSON.stringify(auth))
  }
})