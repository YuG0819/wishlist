const Log = require('./log')
class commonFnc {
  static TAG = "commonFnc ";

  /*计算两日期的间隔天数*/
  static getDateDiff(startDate, endDate) {
    let startTime = new Date(Date.parse(startDate.replace(/-/g, "/"))).getTime();
    let endTime = new Date(Date.parse(endDate.replace(/-/g, "/"))).getTime();
    let dates = Math.abs((startTime - endTime)) / (1000 * 60 * 60 * 24);
    return dates;
  }
  static dateFormat(fmt,date) {
    var o = {
      "M+" : date.getMonth()+1,                 //月份
      "d+" : date.getDate(),                    //日
      "h+" : date.getHours(),                   //小时
      "m+" : date.getMinutes(),                 //分
      "s+" : date.getSeconds(),                 //秒
      "q+" : Math.floor((date.getMonth()+3)/3), //季度
      "S"  : date.getMilliseconds()             //毫秒
    };
    if(/(y+)/.test(fmt))
      fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
      if(new RegExp("("+ k +")").test(fmt))
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
    return fmt;
  };

  /**
   * 计算生日天数
   */
  static getBirthDayDiff(remDate) {
    const curDate = this.dateFormat("yyyy-MM-dd", new Date());

    let _remDate = remDate.split('-');

    let _remMonth = _remDate[1];
    let _remDay = _remDate[2];

    let _curDate = curDate.split('-');
    let _curYear = _curDate[0];
    let _curMonth = _curDate[1];
    let _curDay = _curDate[2];

    Log.debug(this.TAG,"remDate = " + remDate)
    //检查今年的日期有没有过
    let isPassed = this.checkDatePassed(_remMonth, _remDay, _curMonth, _curDay);
    if (isPassed) {
      //年份加一
      let nextYear = parseInt(_curYear) + 1;
      let remDate_next = nextYear + '-' + _remMonth + '-' + _remDay;

      //比较明年和纪念相差的天数
      let days = this.getDateDiff(curDate, remDate_next);
      return days;
    } else {
      //比较今年和纪念相差的天数
      let remDate_now = _curYear + '-' + _remMonth + '-' + _remDay;
      let days = this.getDateDiff(curDate, remDate_now);
      return days;
    }
  }

  static checkDatePassed(_remMonth, _remDay, _curMonth, _curDay) {
    console.log(_remMonth + '==' + _remDay + '==' + _curMonth + '==' + _curDay + '==');
    if (parseInt(_remMonth) < parseInt(_curMonth)) {
      return true;
    } else if (parseInt(_remMonth) === parseInt(_curMonth) && parseInt(_remDay) < parseInt(_curDay)) {
      return true;
    } else {
      return false;
    }
  }

  static getTimestamp() {
    let timestamp = Date.parse(new Date());
    timestamp = timestamp / 1000;
    return timestamp
  }

}
module.exports = commonFnc