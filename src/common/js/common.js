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
