import React from 'react'

const CALENDAR_LINK = 'https://calendar.google.com/calendar/embed?src=huvrl6on8orta0eq5jvpufjvhg%40group.calendar.google.com'


export default function GoogleCalnedarLink({text}) {
  text = text || 'Переглянути в Google Календарі'
  return <a href={CALENDAR_LINK} target='_blank' rel='noopener noreferrer'>
    {text}
  </a>
}