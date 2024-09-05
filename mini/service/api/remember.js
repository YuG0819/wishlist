const app = getApp()
const commonFnc = require('../../utils/commonFnc.js');
const Log = require('../../utils/log.js')
class rememberApi {
  static TAG = "rememberApi ";

  /**
 * 在一起天数
 */
  static async together(param) {
    Log.debug(this.TAG, "together param = " + JSON.stringify(param))
    let res = await app.call({ name: 'getTogether', data: param })

    Log.debug(this.TAG, "together res = " + JSON.stringify(res))
    if (res.errMsg === 'collection.get:ok') {
      if (res.data.length > 0 && res.data[0].type) {
        let curDate = commonFnc.dateFormat("yyyy-MM-dd", new Date())
        return commonFnc.getDateDiff(res.data[0].time, curDate)
      } else {
        return false
      }
    }
  }

  /**
* 在一起天数
*/
  static async getTogether(param) {
    Log.debug(this.TAG, "together param = " + JSON.stringify(param))
    let res = await app.call({ name: 'getTogether', data: param })

    Log.debug(this.TAG, "together res = " + JSON.stringify(res))
    if (res.errMsg === 'collection.get:ok') {
      if(res.data.length> 0){
        return res.data[0]
      }
    }
  }

  /**
 * 获得其他纪念日（除系统设置的在一起天数）
 */
  static async get(param) {
    Log.debug(this.TAG, "get param = " + JSON.stringify(param))

    let res = await app.call({ name: 'getRemember', data: param })
    Log.debug(this.TAG, "get res = " + JSON.stringify(res))

    if (res.errMsg === 'collection.get:ok') {
      return res.data
    }
  }

}
module.exports = rememberApi