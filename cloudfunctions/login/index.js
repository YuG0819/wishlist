// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境
const db = cloud.database()
// 云函数入口函数
exports.main = async (event) => {
  let { OPENID } = cloud.getWXContext();
  let param = {
    _openid: OPENID,
    avatarUrl: event.avatarUrl,
    code: event.code,
    gender: event.gender,
    nickName: event.nickName,
  };
  if (event.id) {
    const res = await db.collection('user').doc(event.id).get()

    return res
  } else {
    const id = await db.collection('user').add({
      data: param
    })
    console.log("id = " + id._id)
    return await db.collection('user').doc(id._id).get()
  }

}