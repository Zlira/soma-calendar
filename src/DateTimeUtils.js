export const DOWs = [
  'неділя',
  'понеділок',
  'вівторок',
  'середа',
  'четвер',
  "п'ятниця",
  'субота',
]

export const MONTHs = [
  'Січень',
  'Лютий',
  'Березень',
  'Квітень',
  'Травень',
  'Червень',
  'Липень',
  'Серпень',
  'Вересень',
  'Жовтень',
  'Листопад',
  'Грудень'
]

export function addDays(date, days) {
  const newDate = new Date(date)
  newDate.setDate(newDate.getDate() + days)
  return newDate
}


export function isSameDate(d1, d2) {
  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
}

export function formatTime(dt) {
  dt = new Date(dt)
  const hours = zeroPadded(dt.getHours())
  const minutes = zeroPadded(dt.getMinutes())
  return hours + ':' + minutes
}


export function zeroPadded(n) {
  return n.toString().padStart(2, '0')
}

export function formatDate(dt) {
  return `${zeroPadded(dt.getMonth() + 1)}.${zeroPadded(dt.getDate())}`
}

export function getLastMonday() {
  let date = new Date()
  date.setHours(0)
  date.setMinutes(0)
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() - 1)
  }
  return date
}

export function formatDateRange(startDate, endDate) {
  // todo deal with end date - 1 in some more consistent way
  // i.e. take timezones into account
  endDate = addDays(endDate, -1)
  const startMonth = MONTHs[startDate.getMonth()].toLocaleLowerCase()
  const endMonth = MONTHs[endDate.getMonth()].toLocaleLowerCase()
  if (startMonth === endMonth) {
    return `${startMonth} ${startDate.getDate()} - ${endDate.getDate()}`
  } else {
    return `${startMonth} ${startDate.getDate()} - ${endMonth} ${endDate.getDate()}`
  }
}


export function getDateRange(startDate, endDate) {
  const range = [startDate]
  while (range[range.length - 1] < endDate) {
    range.push(addDays(range[range.length - 1], 1))
  }
  return range
}