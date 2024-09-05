const Log = require("../../utils/log");
const utils = require("../../utils/util");
const commonApi = require("../../service/api/common");

// pages/information/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isBind: true,
    auth: wx.getStorageSync('auth'),
    TAG: "information ",
    show: false,
    showpopup: false,
    nickname: "微信用户",
    newnickname: "",
    columns: ['男', '女'],
    gender: "",
    avatarUrl: "https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0",
  },

  updateNickName(event) {
    console.log(this.data.TAG + "updateNickName " + this.data.newnickname);
    this.data.newnickname = this.data.auth.user.nickName
    this.setData({
      show: true,
    });
  },

  onClose() {
    this.setData({
      show: false,
      nickname: this.data.nickname
    });
  },
  dialogInput(event) {
    this.data.newnickname = event.detail
  },
  async confirm() {
    Log.debug(this.data.TAG, "confirm newnickname = " + this.data.newnickname)
    let param = {
      method: 'update',
      collection: 'user',
      doc: this.data.auth.user._id,
      content: {
        nickName: this.data.newnickname
      }
    }
    let res = await commonApi.update(param);
    Log.debug(this.data.TAG, "confirm res = " + JSON.stringify(res))
    this.data.auth.user.nickName = this.data.newnickname
    this.setData({
      auth: this.data.auth,
    })
  },
  switchSex() {
    console.log(this.data.TAG + "open popup")
    this.setData({
      showpopup: true
    })
  },
  onClosePopup() {
    console.log(this.data.TAG + "close popup")
    this.setData({
      showpopup: false
    })
  },

  closePicker() {
    this.setData({ showpopup: false });
  },
  async confirmPicker(e) {
    Log.debug(this.data.TAG, "confirmPicker gender = " + e.detail.index)
    let param = {
      method: 'update',
      collection: 'user',
      doc: this.data.auth.user._id,
      content: {
        gender: e.detail.index
      }
    }
    let res = await commonApi.update(param);
    Log.debug(this.data.TAG, "confirmPicker res = " + JSON.stringify(res))
    this.data.auth.user.gender = e.detail.index
    this.setData({
      auth: this.data.auth,
      showpopup: false
    })
  },
  //头像
  async onChooseAvatar(e) {
    const { avatarUrl } = e.detail
    Log.debug(this.data.TAG, "onChooseAvatar avatarUrl = " + avatarUrl)
    Log.debug(this.data.TAG, "onChooseAvatar dateFormat = " + utils.dateFormat("yyyy-MM-dd", new Date()))
    const cloudPath = utils.dateFormat("yyyy-MM-dd", new Date()) + '/' + this.data.auth.user._id + "-" + new Date().getTime() + '.png'
    wx.cloud.uploadFile({
      cloudPath: cloudPath,
      filePath: avatarUrl, // 文件路径
      success: async res => {
        // get resource ID
        Log.debug(this.data.TAG, "文件上传 success fileID = " + res.fileID)

        let param = {
          method: 'update',
          collection: 'user',
          doc: this.data.auth.user._id,
          content: {
            avatarUrl: res.fileID,
            filePath: cloudPath,
            updateTime: utils.dateFormat("yyyy-MM-dd hh:mm:ss", new Date())
          }
        }
        let res_update = await commonApi.update(param);
        Log.debug(this.data.TAG, "onChooseAvatar res_update = " + JSON.stringify(res_update))
        this.data.auth.user.avatarUrl = res.fileID
        this.setData({
          auth: this.data.auth
        })
        Log.debug(this.data.TAG, "onChooseAvatar auth = " + JSON.stringify(this.data.auth))

      },
      fail: err => {
        // handle error
        Log.error(this.data.TAG, "文件上传 fail err = " + err)
      }
    })

    // wx.setStorageSync('auth',this.data.auth)
  },
  getInformation() {
    this.setData({
      auth: wx.getStorageSync('auth')
    })
    if (!this.data.auth.user.bindId) {
      this.setData({
        isBind: false
      })
    }
    wx.stopPullDownRefresh();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    Log.debug(this.data.TAG, "new Date() = " + new Date().getTime())
    this.getInformation()
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
    Log.info(this.data.TAG, "onUnload")
    wx.setStorageSync('auth', this.data.auth)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    this.getInformation()
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