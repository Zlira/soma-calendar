const CALNEDAR_ID = 'huvrl6on8orta0eq5jvpufjvhg@group.calendar.google.com'
const EVENTS_URL = `https://www.googleapis.com/calendar/v3/calendars/${CALNEDAR_ID}/events`


function getParams(startDate, endDate) {
  return new URLSearchParams({
    key: 'AIzaSyCSfbZP7HVduNPD1s-1aVwQe5pSYWn8WSk',
    singleEvents: true,
    showDeleted: false,
    orderBy: 'startTime',
    timeMin: startDate.toISOString(),
    timeMax: endDate.toISOString(),
  })
}

export function getEvents(startDate, endDate) {
  const url = new URL(EVENTS_URL)
  url.search = getParams(startDate, endDate)
  return fetch(url).then(
    res => res.json(),
  ).then(
    jsn => {
      if (jsn.error) {
        throw jsn.error
      }
      return jsn
    }
  )
}