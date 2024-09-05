const Log = require("../../utils/log");

// pages/minedata/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    TAG:"Page minedata",
    isBind:true,
    userinfo: wx.getStorageSync('user'),
    openid: wx.getStorageSync('userOpenid'),
    auth: wx.getStorageSync('auth'),
    datalist: "",
    newtime: `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, '0')}-${(new Date().getDate()).toString().padStart(2, '0')}`,
    day: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    // this.getMyInvite();
    this.getMine();
  },
  getMine() {
    Log.debug(this.data.TAG,"getMine")
    this.setData({
      auth: wx.getStorageSync('auth')
    })
    Log.debug(this.data.TAG,"this.data auth = "+JSON.stringify(this.data.auth))

    if(!this.data.auth.user.bindId){
      this.setData({
        isBind: false
      })
    }
    wx.stopPullDownRefresh();
  },
  async getMyInvite() {
    this.setData({
      userinfo: wx.getStorageSync('user')
    })
    const that = this;
    const res = await app.call({
      // 云函数名称
      name: 'wishes-520',
      // 传给云函数的参数
      data: {
        type: 'getMyInvite'
      }
    })
    that.setData({
      datalist: res.data,
      day: res.data ? that.timesize(that.data.newtime, res.data.memorialDayTime) : 'xxxx',
      userinfo: wx.getStorageSync('user')
    })
    wx.stopPullDownRefresh();
  },
  async updateTa() {
    this.getMyInvite();
    const that = this;
    try {
      const res = await app.call({
        // 云函数名称
        name: 'wishes-520',
        // 传给云函数的参数
        data: {
          type: 'updateMyInvite',
          _id: that.data.datalist._id
        }
      })
      that.offMask();
      wx.showToast({
        title: '修改成功',
        icon: 'success'
      })
      wx.removeStorageSync('recipientId');
      setTimeout(() => {
        wx.reLaunch({
          url: '../minedata/index',
        })
      }, 1000)
    } catch (error) {
      wx.showToast({
        title: '请邀请Ta\n 以激活功能',
        icon: 'error'
      })
      that.offMask();
    }
  },
  router(e) {
    try {
      wx.navigateTo({
        url: `${e.currentTarget.dataset.url}?id=${e.currentTarget.dataset.id}&memorialDayNoticeTime=${this.data.datalist.memorialDayNoticeTime}&memorialDayTime=${this.data.datalist.memorialDayTime}&memorialDayName=${this.data.datalist.memorialDayName}`,
      })
    } catch (error) {
      wx.showToast({
        title: '请邀请Ta\n 以激活功能',
        icon: 'error'
      })
    }
  },
  timesize(beginDate, endDate) {
    console.log("minedata timesize beginDate = " + beginDate)
    console.log("minedata timesize endDate = " + endDate)
    if (beginDate != '' && endDate != '') {
      var aDate, oDate1, oDate2, iDays;
      if (beginDate.length == 8) {
        beginDate = beginDate.substr(0, 4) + '-' + beginDate.substr(4, 2) + '-' + beginDate.substr(6, 2);
      }
      if (endDate.length == 8) {
        endDate = endDate.substr(0, 4) + '-' + endDate.substr(4, 2) + '-' + endDate.substr(6, 2);
      }
      aDate = beginDate.split("-");
      oDate1 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0]); //转换为12/13/2008格式
      aDate = endDate.split("-");
      oDate2 = new Date(aDate[1] + '/' + aDate[2] + '/' + aDate[0]);
      var i = (oDate1 - oDate2) / 1000 / 60 / 60 / 24;

      iDays = i; //把相差的毫秒数转换为天数
      return iDays;
    } else {
      return 0;
    }
  },
  onMask() {
    if (wx.getStorageSync('recipientId')) {
      this.setData({
        maskshow: true
      })
    }
  },
  offMask() {
    this.setData({
      maskshow: false
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.getMine();
   },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {
    // this.getMyInvite();
    this.getMine();
  },

  goinformation() {
    wx.navigateTo({
      url: `../information/index`,
    })
  }


})