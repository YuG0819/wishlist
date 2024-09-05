// 云函数入口文件
const cloud = require('wx-server-sdk')
const TcbRouter = require('tcb-router')

const getService = require('./get');
const docService = require('./doc');
const delService = require('./del');
const updateService = require('./update');
const addService = require('./add');

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
     const app = new TcbRouter({ event });
  const db = cloud.database();

  const _ = db.command;

  app.router('get', async (ctx, next) => {
    const data = await getService(db,_,event)
    ctx.body = {
      code: '200',
      data:data
    }
  });

  app.router('doc', async (ctx, next) => {
    const data = await docService(db,_,event)
    ctx.body = {
      code: '200',
      data:data
    }
  });

  app.router('del', async (ctx, next) => {
    const data = await delService(db,_,event)
    ctx.body = {
      code: '200',
      data:data
    }
  });

  app.router('update', async (ctx, next) => {
    const data = await updateService(db,_,event)
    ctx.body = {
      code: '200',
      data:data
    }
  });

  app.router('add', async (ctx, next) => {
    const data = await addService(db,_,event)
    ctx.body = {
      code: '200',
      data:data
    }
  });


  return app.serve()
}