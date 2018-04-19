/**
 * 时间格式化工具
 * 调用方式：new Date().format("yyyy-MM-dd hh:mm:ss.S")
 * @param format 时间格式，如："yyyy-MM-dd hh:mm:ss.S"
 * @returns String "2017-05-13 10:40:00.000"
 */
Date.prototype.format = function (format) {
  format = format || 'YYYY-MM-DD hh:mm:ss'
  // 日期格式化
  var o = {
    'M+': this.getMonth() + 1, // month
    'd+': this.getDate(), // day
    'h+': this.getHours(), // hour
    'm+': this.getMinutes(), // minute
    's+': this.getSeconds(), // second
    'q+': Math.floor((this.getMonth() + 3) / 3), // quarter
    'S': this.getMilliseconds() // millisecond
  }
  if (/(y+)/.test(format)) { format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)) }
  for (var k in o) {
    if (o.hasOwnProperty(k) && new RegExp('(' + k + ')').test(format)) { format = format.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)) }
  }
  return format
}
/**
 * 持续时间 计算
 * @param times 持续毫秒数
 * @param format 格式，如："dd天h小时mm分钟"
 * @returns String 00天1小时13分钟
 */
Date.timeOfDuration = function(times, format) {
  format = format ? format : "dd天hh小时mm分钟";
  var temp, total, fields = [ [86400000, /(d+)/], [3600000, /(h+)/], [60000, /(m+)/], [1000, /(s+)/] ];
  for (var i in fields) {
    if (fields.hasOwnProperty(i) && fields[i][1].test(format)) {
      temp = Math.floor(times / fields[i][0]);
      times = times % fields[i][0];
      total = Math.max(RegExp.$1.length, ("" + temp).length);
      format = format.replace(RegExp.$1, (Array(total).join("0") + temp).slice(-total));
    }
  }
  if (/(S)/.test(format)) {
    total = Math.max(RegExp.$1.length, ("" + times).length);
    format = format.replace(RegExp.$1, (Array(total).join("0") + times).slice(-total));
  }
  temp = null;
  total = null;
  fields = null;
  return format;
}
