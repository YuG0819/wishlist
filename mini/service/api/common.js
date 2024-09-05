const app = getApp()
const Log = require('../../utils/log.js')
class commonApi {
  static TAG = "commonApi ";
  /**
   * 首页各部分条数
   */
  static async getCount(param) {
    //首页todo/remember count
    let todo = await app.call({ name: "getCount", data: { collection: 'todo', ...param } });
    let remember = await app.call({ name: "getCount", data: { collection: 'remember', ...param } });
    Log.debug(this.TAG, "getCount todo = " + JSON.stringify(todo))
    Log.debug(this.TAG, "getCount remember = " + JSON.stringify(remember))
    return {
      todo: todo,
      remember:remember
    }
  }

  /**
 * 通过Id查详情
 * @param param
 * @returns {Promise<void>}
 */
  static async doc(param) {
    Log.debug(this.TAG, "doc param = " + JSON.stringify(param))
    let res = await app.call({ name: "collection", data: { $url: param.method, ...param } });

    Log.debug(this.TAG, "doc res = " + JSON.stringify(res))
    if (res.code === '200') {
      return res.data
    }
  }

  /**
 * 向集合里新增数据
 * @param param
 * @returns {Promise<void>}
 */
  static async add(param) {
    Log.debug(this.TAG, "add param = " + JSON.stringify(param));
    let res = await app.call({ name: "collection", data: { $url: param.method, ...param } });

    if (res.code === '200') {
      return res.data
    }
  }

  /**
 * 通过Id更新
 * @param param
 * @returns {Promise<void>}
 */
  static async update(param) {
    Log.debug(this.TAG, "update param = " + JSON.stringify(param));
    let res = await app.call({ name: "collection", data: { $url: param.method, ...param } });
    if (res.code === '200') {
      return res.data
    }
  }

  /**
 * 查一个表的集合
 */
  static async list(param) {
    Log.debug(this.TAG, "list param = " + JSON.stringify(param));
    let res = await app.call({ name: 'collection', data: { $url: param.method, ...param } });
    Log.debug(this.TAG, "list res = " + JSON.stringify(res));
    if (res.code === '200') {
      return res.data
    }
  }


}

module.exports = commonApi