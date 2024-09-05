// components/popup/todo/index.js
const commonApi = require("../../../service/api/common.js")
const Log = require("../../../utils/log.js")
const utils = require("../../../utils/util.js")

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    item: {
      type: Object
    },
    hide: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    TAG: "Components todo",
    contentshow: 'true',
    textarea: '如果你更详细地告诉我，说不定我\n给你一个更大的惊喜哟！😘',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    switchChange(e) {
      Log.debug(this.data.TAG, "状态 index = " + e.detail.index)
      Log.debug(this.data.TAG, "状态 value = " + e.detail.value)
      Log.debug(this.data.TAG, "状态 item = " + JSON.stringify(this.data.item))
      this.data.item.isComplete = e.detail.value ? 1 : 0
      this.setData({
        item: this.data.item
      })
    },
    //隐藏弹窗
    hidepopup(e) {
      Log.debug(this.data.TAG, "hidepopup = " + e.target.dataset.canclose)

      if (e.target.dataset.canclose) {
        this.triggerEvent("hidePopup", { hide: true })
        this.setData({
          hide: true
        })
      }
    },
    inputTitle(e) {
      this.data.item.title = e.detail.value
      this.setData({
        item: this.data.item
      })
      Log.debug(this.data.TAG, "标题 item = " + JSON.stringify(this.data.item))
    },
    bindinput(e) {
      this.data.item.msg = e.detail.value
      this.setData({
        item: this.data.item
      })
      Log.debug(this.data.TAG, "更多内容 = " + JSON.stringify(this.data.item))
    },
    buttonhidepopup() {
      Log.debug(this.data.TAG, "buttonhidepopup")
      this.triggerEvent("hidePopup", { hide: true })
      this.setData({
        hide: true
      })
    },
    async createtodo() {
      Log.debug(this.data.TAG, "createtodo item = " + JSON.stringify(this.data.item))
      if (this.data.item.title && this.data.item.msg) {
        if (!this.data.item.id) {
          let param = {
            method: 'add',
            collection: 'todo',
            content: {
              title: this.data.item.title,
              content: this.data.item.msg,
              isComplete: this.data.item.isComplete,
              fileList: this.data.item.fileList,
              createTime: utils.dateFormat("yyyy-MM-dd hh:mm:ss", new Date()),
              createId: wx.getStorageSync('auth').user._id,
              updateTime: utils.dateFormat("yyyy-MM-dd hh:mm:ss", new Date()),
              updateId: wx.getStorageSync('auth').user._id,
              bindId: wx.getStorageSync('auth').user.bindId
            }
          };
          let res = await commonApi.add(param)
          Log.debug(this.data.TAG, "新增数据 res = " + JSON.stringify(res))
        } else {
          Log.debug(this.data.TAG, "更新数据 id = " + this.data.item.id)
          let param = {
            method: 'update',
            collection: 'todo',
            doc: this.data.item.id,
            content: {
              title: this.data.item.title,
              content: this.data.item.msg,
              isComplete: this.data.item.isComplete,
              fileList: this.data.item.fileList,
              updateTime: utils.dateFormat("yyyy-MM-dd hh:mm:ss", new Date()),
              updateId: wx.getStorageSync('auth').user._id,
            }
          }
          let res = await commonApi.update(param)
          Log.debug(this.data.TAG, "更新数据 res = " + JSON.stringify(res))
        }
        wx.reLaunch({
          url: '/pages/todo/index',
        })
      } else {
        wx.showToast({
          title: '请输入标题和更多信息',
          icon: 'error',
        })
      }
    },

    //上传图片
    afterRead(event) {
      const { file } = event.detail;
      Log.debug(this.data.TAG, "afterRead event = " + JSON.stringify(file))
      file.forEach((element) => {
        const arr = []
        const filename = new Date().getTime()
        const cloudPath = "todo" + '/' + this.data.item.title + "/" + filename + '.png'
        Log.debug(this.data.TAG, "afterRead cloudPath = " + cloudPath)
        wx.cloud.uploadFile({
          cloudPath: cloudPath,
          filePath: element.url, // 文件路径
          success: async res => {
            // get resource ID
            Log.debug(this.data.TAG, "文件上传 success fileID = " + res.fileID)
            arr.push({
              url: res.fileID,
              // name: index,
              type: element.type
            })
            Log.debug(this.data.TAG, "新增图片 arr = " + JSON.stringify(arr))
            this.data.item.fileList = [...this.data.item.fileList, ...arr]
            this.setData({
              item: this.data.item
            })
            Log.debug(this.data.TAG, "新增图片 item = " + JSON.stringify(this.data.item))
            let update_res = await this.updateImage(this.data.item)
            Log.debug(this.data.TAG, "afterRead 更新图片数据 res = " + JSON.stringify(update_res))
          },
          fail: err => {
            // handle error
            Log.error(this.data.TAG, "文件上传 fail err = " + err)
          }
        })
      });


    },
    //delete 图片的index
    async delete_upload(event) {
      const del_index = event.detail.index
      const file = this.data.item.fileList[del_index].url
      Log.debug(this.data.TAG, "delete_upload del_index = " + del_index)
      Log.debug(this.data.TAG, "delete_upload file = " + file)
      this.data.item.fileList.splice(del_index, 1)

      let update_res = await this.updateImage(this.data.item)
      Log.debug(this.data.TAG, "delete_upload 更新数据 res = " + JSON.stringify(update_res))

      wx.cloud.deleteFile({
        fileList: [file],
        success: res => {
          // handle success
          Log.debug(this.data.TAG, "delete_upload res.fileList = " + res.fileList)
        },
        fail: err => {
          // handle error
          Log.error(this.data.TAG, "delete_upload err = " + err)
        },
      })
      Log.debug(this.data.TAG, "delete_upload this.data.item = " + JSON.stringify(this.data.item))
      this.setData({
        item: this.data.item
      })
    },
    async updateImage(item) {
      if (item.id) {
        let param = {
          method: 'update',
          collection: 'todo',
          doc: item.id,
          content: {
            fileList: item.fileList,
            updateTime: utils.dateFormat("yyyy-MM-dd hh:mm:ss", new Date()),
            updateId: wx.getStorageSync('auth').user._id,
          }
        }
        let res = await commonApi.update(param)
        Log.debug(this.data.TAG, "updateImage 更新数据 res = " + JSON.stringify(res))
        return res
      }
    }
  }
})