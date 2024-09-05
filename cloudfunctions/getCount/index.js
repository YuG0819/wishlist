// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
const db = cloud.database();
const _ = db.command;

exports.main = async (event) => {

  const count = await db.collection(event.collection).where({
    createId:_.or(_.eq(event.id),_.eq(event.bindId)),
  }).count();

  return count.total

}