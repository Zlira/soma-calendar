import React from 'react'

import { isSameDate, getDateRange } from './DateTimeUtils'

const DayParts = [
  {
    name: 'morning',
    endHour: 11,
  }, {
    name: 'day',
    endHour: 18,
  }, {
    name: 'evening',
    endHour: 24
  }
]

export function parseEvent(event) {
  console.log(event.id)
  let description
  try {
    description = <span dangerouslySetInnerHTML={{ __html: event.description }}></span>
  } catch {
    description = [
      <React.Fragment key={0}>{event.description}</React.Fragment>
    ]
  }
  const processed = {
    id: event.id,
    summary: event.summary,
    description: description,
    startDT: new Date(event.start.dateTime),
    endDT: new Date(event.end.dateTime)
  }
  if (isNaN(processed.startDT) || isNaN(processed.endDT)) {
    throw new Error('Could not parse datetimes')
  }
  return processed
}

export function splitToBins(bins, binMembershipFunc, items) {
  items = Array.from(items).reverse()
  const result = []
  let item = items.pop()
  let currItems = []
  for (let bin of bins) {
    while (item !== undefined && binMembershipFunc(bin, item)) {
      currItems.push(item)
      item = items.pop()
    }
    result.push([bin, currItems])
    currItems = []
  }
  return result
}

// handle events out of the range
export function splitEventsByDaypart(events) {
  const res = splitToBins(
    DayParts, (dp, event) => event.startDT.getHours() < dp.endHour,
    events
  ).map(el => [el[0].name, el[1]])

  return [...res]
}

// merege with daypart splitter
export function splitEventsByDate(events, startDate, endDate) {
  events = events.filter(e => e.startDT >= startDate)
  // assuming events are sorted in ascending order
  const dateRange = getDateRange(startDate, endDate)
  const res = splitToBins(
    dateRange, (bin, event) => isSameDate(bin, event.startDT),
    events
  )
  console.log(res)
  return res
}