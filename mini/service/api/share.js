const app = getApp()
const Log = require('../../utils/log.js')

class shareApi {
  static TAG = "shareApi"

  /**
   * 绑定关系
   */
  static async bindLoving(param) {

    Log.debug(this.TAG, "param = " + param);

    //判定是否绑定关系
    let isBind = await this.checkSameUser();
    Log.debug(this.TAG, '判定是否绑定关系' + isBind)
    if (isBind) {
      return {
        msg: '您已经绑定过情侣关系了'
      };
    }
    //更新我的数据
    let paramMe = {
      method: 'update',
      collection: 'user',
      doc: param.id,
      content: {
        bindId: param.bindId
      }
    };
    Log.debug(this.TAG, 'aaaaa');
    let bindMe = await app.call({ name: "collection", data: { $url: paramMe.method, ...paramMe } });
    Log.debug(this.TAG, 'bindMe');
    Log.debug(this.TAG, JSON.stringify(bindMe));

    let paramTa = {
      method: 'update',
      collection: 'user',
      doc: param.bindId,
      content: {
        bindId: param.id
      }
    };
    let bindTa = await app.call({ name: "collection", data: { $url: paramTa.method, ...paramTa } });
    Log.debug(this.TAG, 'bindTa');
    Log.debug(this.TAG, JSON.stringify(bindTa));
    return {
      msg: '绑定成功！'
    }

  }

  /**
   * 判定是否绑定关系
   */
  static async checkSameUser() {
    let res = await app.call({ name: "checkSameUser", data: {} });
    if (res.data.length > 0) {
      return res.data[0].bindId ? true : false;
    } else {
      return false
    }
  }
}
module.exports = shareApi