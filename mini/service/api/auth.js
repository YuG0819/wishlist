const app = getApp()
const Log = require('../../utils/log.js')
class authApi {
  static TAG = "authApi"
  /**
   * 微信授权登录
   */
  static async wxCloudLogin(param) {
    //判定是否授权登陆
    let id = await this.checkSameUser();
    if (id) {
      param.id = id;
    }
    Log.debug(this.TAG, "wxCloudLogin param = " + JSON.stringify(param))
    let res = await app.call({ name: "login", data: param })
    Log.debug(this.TAG, "wxCloudLogin res = " + JSON.stringify(res))


    if (res.errMsg === 'collection.add:ok' || res.errMsg === 'document.get:ok') {
      return res.data
    }
  }

  /**
   * 判定是否注册过
   */
  static async checkSameUser() {
    Log.debug(this.TAG, "checkSameUser 判定是否注册过")
    let res = await app.call({ name: "checkSameUser", data: {} });
    Log.debug(this.TAG, "checkSameUser res = " + JSON.stringify(res))

    if (res.errMsg === 'collection.get:ok') {
      if (res.data.length > 0) {
        return res.data[0]._id;
      } else {
        return false
      }
    }
  }

  /**
   * 判定是否绑定关系
   */
  static async checkBindInfo() {
    let user;
    let bindUser;
    let res = await app.call({ name: "checkSameUser", data: {} });
    user = res.data[0];
    Log.debug(this.TAG, "checkBindInfo res = " + JSON.stringify(res))
    if (user.bindId) {
      Log.debug(this.TAG, "checkBindInfo bindId = " + JSON.stringify(user.bindId))

      //获取对象的信息
      let bindRes = await app.call({ name: "getUserInfoById", data: { id: user.bindId } });
      bindUser = bindRes.data[0];
    }
    return {
      user: user,
      bindUser: bindUser || false
    }
  }

}

module.exports = authApi