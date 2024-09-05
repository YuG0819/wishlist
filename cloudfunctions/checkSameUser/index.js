// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

const db = cloud.database();

// 云函数入口函数
exports.main = async (event) => {
  console.log("云函数checkSameUser")
  let { OPENID } = cloud.getWXContext();

  return db.collection('user').where({
      _openid: OPENID // 填入当前用户 openid
  }).get();
}