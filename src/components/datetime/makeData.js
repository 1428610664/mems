function isLeapYear (year) {
  return year % 100 !== 0 && year % 4 === 0 || year % 400 === 0
}

function getMaxDay (year, month) {
  year = parseFloat(year)
  month = parseFloat(month)
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28
  }
  return [4, 6, 9, 11].indexOf(month) >= 0 ? 30 : 31
}


function getHours (startDate, endDate, year, month,day) {
  console.log("getHours",startDate,endDate)
  const startYear = startDate.getFullYear()
  const endYear = endDate.getFullYear()
  const startMonth = startDate.getMonth() + 1
  const endMonth = endDate.getMonth() + 1
  const startDay = startDate.getDate()
  const endDay = endDate.getDate()
  const startHours = startDate.getHours()
  const endHours = endDate.getHours()

  let start = 0
  let end = 23

  if (year === startYear && month === startMonth && day === startDay ) {
    start = startHours
  }
  if (year === endYear && month === endMonth && day === endDay ) {
    end = endHours
  }
  return {
    minHours: start,
    maxHours: end
  }
}
function getMinute (startDate, endDate, year, month,day, hour) {
  console.log("getMinute",startDate,endDate)
  const startYear = startDate.getFullYear()
  const endYear = endDate.getFullYear()
  const startMonth = startDate.getMonth() + 1
  const endMonth = endDate.getMonth() + 1
  const startDay = startDate.getDate()
  const endDay = endDate.getDate()
  const startHours = startDate.getHours()
  const endHours = endDate.getHours()
  const startMinute = startDate.getMinutes()
  const endMinute = endDate.getMinutes()

  let start = 0
  let end = 59

  if (year === startYear && month === startMonth && day ===startDay && hour ===startHours ) {
    start = startMinute
  }
  if (year === endYear && month === endMonth && day ===endDay && hour === endHours ) {
    end = endMinute
  }
  return {
    minMinute: start,
    maxMinute: end
  }
}
function getSecond (startDate, endDate, year, month,day, hour,minute) {
  console.log("getSecond",startDate,endDate)
  const startYear = startDate.getFullYear()
  const endYear = endDate.getFullYear()
  const startMonth = startDate.getMonth() + 1
  const endMonth = endDate.getMonth() + 1
  const startDay = startDate.getDate()
  const endDay = endDate.getDate()
  const startHours = startDate.getHours()
  const endHours = endDate.getHours()
  const startMinute = startDate.getMinutes()
  const endMinute = endDate.getMinutes()
  const startSecond = startDate.getSeconds()
  const endSecond = endDate.getSeconds()

  let start = 0
  let end =59

  if (year === startYear && month === startMonth && day ===startDay && hour ===startHours && minute ===startMinute) {
    start = startSecond
  }
  if (year === endYear && month === endMonth && day ===endDay && hour === endHours && minute ===endMinute ) {
    end = endSecond
  }
  return {
    minSecond: start,
    maxSecond: end
  }
}

export {
  getHours,
  getMinute,
  getSecond
}
