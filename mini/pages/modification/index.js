// pages/modification/index.js
const Log = require("../../utils/log");
const utils = require("../../utils/util");
const commonApi = require("../../service/api/common.js")

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TAG: "Pages modification",
    date: '1999-08-19',
    remind: '提前7天',
    rememberType: "累计日",
    type:"",
    inputdata: "",
    id: "",
    showpopup: false,
    currentDate: utils.dateFormat("yyyy-MM-dd", new Date()),
    maxDate: utils.dateFormat("yyyy-MM-dd", new Date()),
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    Log.debug(this.data.TAG, "onLoad options = " + JSON.stringify(options))
    this.setData({
      currentDate: options.time,
      inputdata: options.title,
      rememberType:options.rememberType,
      id: options.id || "",
      type:options.type || ""
    })
    Log.debug(this.data.TAG, "onLoad id = " + this.data.id)
  },

  bindDateChange: function (e) {
    Log.debug(this.data.TAG, "bindDateChange currentDate = " + e.detail.value)
    this.setData({
      currentDate: e.detail.value
    })

  },
  remind() {
    const that = this;
    const reminddata = ['提前7天', '提前15天', '提前一个月']
    wx.showActionSheet({
      itemList: ['提前7天', '提前15天', '提前一个月'],
      success(res) {
        that.setData({
          remind: reminddata[res.tapIndex]
        })
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  rememberType(){
    const reminddata = ['累计日', '(周年)倒数日']
    wx.showActionSheet({
      itemList: ['累计日', '(周年)倒数日'],
      success:res=> {
        this.setData({
          rememberType: reminddata[res.tapIndex]
        })
        Log.debug(this.data.TAG,"rememberType = " + this.data.rememberType)
      },
      fail:err=>  {
        Log.error(this.data.TAG,"err = " + err.errMsg)
      }
    })
  },
  async preservation() {
    Log.debug(this.data.TAG, "preservation currentDate = " + this.data.currentDate)
    Log.debug(this.data.TAG, "preservation inputdata = " + this.data.inputdata)
    if (this.data.id) {
      // update
      let param = {
        method: 'update',
        collection: 'remember',
        doc: this.data.id,
        content: {
          title: this.data.inputdata,
          time: this.data.currentDate,
          rememberType: this.data.rememberType,
        }
      }
      Log.debug(this.data.TAG, "更新数据 param = " + JSON.stringify(param))
      let res = await commonApi.update(param)
      Log.debug(this.data.TAG, "更新数据 res = " + JSON.stringify(res))

    } else {
      // add
      let param = {
        method: 'add',
        collection: 'remember',
        content: {
          title: this.data.inputdata,
          time: this.data.currentDate,
          rememberType: this.data.rememberType,
          type:this.data.type,
          createId: wx.getStorageSync('auth').user._id,
          bindId: wx.getStorageSync('auth').user.bindId
        }
      }
      let res = await commonApi.add(param)
      Log.debug(this.data.TAG, "更新数据 res = " + JSON.stringify(res))

    }

    wx.reLaunch({
      url: '../remember/index',
    })
  },
  inputvalue(e) {
    Log.debug(this.data.TAG, "inputvalue inputdata = " + e.detail.value)
    this.setData({
      inputdata: e.detail.value
    })
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