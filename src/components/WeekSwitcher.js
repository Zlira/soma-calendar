import React from 'react'

import {formatDateRange} from '../DateTimeUtils.js'


export default function WeekSwitcher({startDate, endDate, incrementDate}) {
  return (
    <div className="calendar__week-switcher">
      <button className="calendar__week-switcher-button" onClick={() => incrementDate(-7)}>{'<'}</button>
      <button className="calendar__week-switcher-button" onClick={() => incrementDate(7)}>{'>'}</button>
      <h2 className="calendar__week-title">
        {formatDateRange(startDate, endDate)}
      </h2>
    </div>
  )
}