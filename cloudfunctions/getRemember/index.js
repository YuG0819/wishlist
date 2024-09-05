// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
const db = cloud.database();
const _ = db.command;
exports.main = async (event) => {

  let getRet = await db.collection('remember').where({
    type:_.neq('together'),
    createId:_.or(_.eq(event.id),_.eq(event.bindId))
  }).get();

  return getRet

}