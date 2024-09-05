// pages/remember/index.js
const utils = require("../../utils/util.js")
const CommonFunc = require("../../utils/commonFnc")
const Log = require("../../utils/log")
const commonApi = require("../../service/api/common")
const commonFnc = require("../../utils/commonFnc")
const rememberApi = require("../../service/api/remember.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TAG: "Page remember",
    together: {
      title: '我们在一起已经',
      time: utils.dateFormat("yyyy-MM-dd", new Date()),
      type: 'together'
    },
    togetherNum: '',
    remember: [],
    hidepopup: true,
    auth: wx.getStorageSync('auth'),
    item: {
      createId: wx.getStorageSync('auth').user._id,
      bindId: wx.getStorageSync('auth').user.bindId,
      time: utils.dateFormat("yyyy-MM-dd", new Date()),
      title: ""
    },
  },
  updateRemember(e) {
    const data = e.currentTarget.dataset.item
    Log.debug(this.data.TAG, "updateRemember data = " + JSON.stringify(data))
    if (data.type == "together") {
      Log.debug(this.data.TAG, "updateRemember -------------------- ")
      wx.navigateTo({
        url: `../modification/index?time=${data.time}&title=${data.title}&rememberType=${data.rememberType || "累计日"}&type=${data.type}`,
      })
    } else {
      wx.navigateTo({
        url: `../modification/index?time=${data.time}&title=${data.title}&id=${data._id}&rememberType=${data.rememberType}`,
      })
    }

  },
  /**
   * 用户点击新增按钮
   */
  isPlus() {
    Log.debug(this.data.TAG, "isPlus")
    wx.navigateTo({
      url: `../modification/index?time=${this.data.item.time}&title=${this.data.item.title}`,
    })
  },
  /**
   * 用户获取remember list
   */
  async getRemember() {
    let param = {
      method: 'get',
      collection: 'remember',
      condition: {
      },
      id: this.data.auth.user._id,
      bindId: this.data.auth.user.bindId,
      start: 0,
      limit: 20
    }
    let res = await rememberApi.get(param)
    res.forEach(element => {
      Log.debug(this.data.TAG, "element = " + JSON.stringify(element))
      if (element.rememberType == "(周年)倒数日") {
        element.day = commonFnc.getBirthDayDiff(element.time)
      } else {
        const curDate = commonFnc.dateFormat("yyyy-MM-dd", new Date());
        element.day = commonFnc.getDateDiff(element.time, curDate)
      }
      element.rememberColor = this.seleteColor()
    });
    Log.debug(this.data.TAG, "res = " + JSON.stringify(res))

    this.setData({
      remember: res
    })
    wx.stopPullDownRefresh()
  },
  dateToDay(date) {
    Log.debug(this.data.TAG, "dateToDay date = " + date)
    const day = CommonFunc.getBirthDayDiff(date)
    Log.debug(this.data.TAG, "dateToDay day = " + day)
    return day

  },
  //获得在一起天数
  async getTogether() {
    let param = {
      id: this.data.auth.user._id,
      bindId: this.data.auth.user.bindId,
    }
    let res = await rememberApi.getTogether(param);
    Log.debug(this.data.TAG, "getTogether res = " + JSON.stringify(res))
    this.data.together.time = res.time
    let curDate = commonFnc.dateFormat("yyyy-MM-dd", new Date())

    this.setData({
      togetherNum: commonFnc.getDateDiff(res.time, curDate) || false,
      together:this.data.together
    })
  },
  seleteColor(){
    const colorList = [
      "bg-gradual-orange",
      "bg-gradual-green",
      "bg-gradual-blue",
      "bg-gradual-pink",
      "bg-gradual-primary",
    ]
    const index = Math.floor(Math.random() * colorList.length);  
    return colorList[index]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getTogether()
    this.getRemember()
    // this.dateToDay("2024-08-28")
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
    Log.debug(this.data.TAG, "onShow")
    this.getTogether()
    this.getRemember()
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
    this.getTogether()
    this.getRemember()
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