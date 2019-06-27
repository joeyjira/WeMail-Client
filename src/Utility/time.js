const MONTHS = {
  '01': 'Jan',
  '02': 'Feb',
  '03': 'Mar',
  '04': 'Apr',
  '05': 'May',
  '06': 'Jun',
  '07': 'Jul',
  '08': 'Aug',
  '09': 'Sep',
  '10': 'Oct',
  '11': 'Nov',
  '12': 'Dec'
}

/*
 * Params: time in this format "2019-06-03T14:29:53.594361-07:00"
 * return: {
 *  date: 'June 3'
 *  time: '2:29 PM'
 * }
 */
function parseTime(time) {
  const result = {}
  // Split time into array of date and time
  const format = time.split("T")

  result.year = format[0].slice(0, 4)
  result.date = getDateString(format[0])
  result.time = getTimeString(format[1])

  return result
}

/*
 * Params: time in this format "2019-06-03"
 * return: "Jun 3"
 */
function getDateString(date) {
  let result = ''

  result += MONTHS[`${date.slice(5, 7)}`]
  result += ` ${parseInt(date.slice(8, 10), 10)}`

  return result
}

/*
 * Params: time in this format "14:29:53.594361-07:00"
 * return: "2:29 PM"
 */
function getTimeString(time) {
  let result = ''
  let format = time.split('.')[0].split(':')
  let hour = parseInt(format[0], 10)
  let meridiem = (hour / 12) >= 1 ? 'PM' : 'AM'

  result += hour % 12 === 0 ? 12 : hour % 12
  result += ':'
  result += format[1]

  return result + ' ' + meridiem
}

export default parseTime
