// pages/todo/index.js
const commonApi = require("../../service/api/common.js");
const Log = require("../../utils/log.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TAG:"Pages todo",
    hidepopup: true,
    item: {},
    tabIsComplete: 0,
    todo: [],
    loading: false,
    auth: wx.getStorageSync('auth'),
    tab: [
      { title: '未完成' },
      { title: '已完成' },
      // 更多 tab...  
    ],
    curIdx: 0, // 当前激活的 tab 索引 

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getTodo()
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
    Log.debug(this.data.TAG,"onShow")
    this.getTodo()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {
    Log.debug(this.data.TAG,"onShow")
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
    this.getTodo()
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

  },
  /**
   * 用户切换tab
   */
  onSwitchTab(index) {
    index = index.currentTarget.dataset.index;
    console.log("todo onSwitchTab idx = " + index)
    this.setData({
      curIdx: index,
      tabIsComplete: index
    }, () => {
      console.log("todo onSwitchTab")
      this.getTodo()
    })
  },

  /**
   * 用户点击新增按钮
   */
  isPlus() {
    this.setData({
      hidepopup: false,
      item: {
        isComplete:0,
        title: '',
        msg: "",
        fileList:[]
      },
    })
  },
  /**
   * 用户隐藏弹窗
   */
  isShowPlusClose() {
    Log.debug(this.data.TAG,"isShowPlusClose")
    this.getTodo()
  },
  /**
   * 用户获取todo list
   */
  async getTodo() {
    let param = {
      method: 'get',
      collection: 'todo',
      condition: {
        isComplete: this.data.tabIsComplete,
      },
      id:this.data.auth.user._id,
      bindId: this.data.auth.user.bindId,
      start:0,
      limit: 20
    }
    let res = await commonApi.list(param)
    this.setData({
      todo: res
    })
    wx.stopPullDownRefresh()
  },
  /**
   * 用户update指定todo
   */
  update_current_item(e) {
    const id = e.currentTarget.dataset.id
    const data = e.currentTarget.dataset.item

    console.log("pages/todo edit_current_item id = " + JSON.stringify(id))
    console.log("pages/todo edit_current_item item = " + JSON.stringify(data))
    this.setData({
      hidepopup: false,
      item: {
        id:data._id,
        title: data.title,
        msg: data.content,
        isComplete:data.isComplete,
        fileList:data.fileList || []
      },
    })
    Log.debug(this.data.TAG,"update_current_item item = " + JSON.stringify(this.data.item))
  }
})