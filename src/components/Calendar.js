import React from 'react'

import WeekSwitcher from './WeekSwitcher'
import { getEvents } from '../CalendarClient'
import {
  parseEvent, splitEventsByDate, splitEventsByDaypart
} from '../EventProcessor.js'
import {
  getLastMonday, addDays, formatDate, formatTime, DOWs
} from '../DateTimeUtils.js'
import hideOnClickOutside from '../DomHelpers'
import GoogleCalendarLink from './GoogleCalendarLink'

import './Calendar.css'



export default class Calendar extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      events: [],
      startDate: getLastMonday(),
      showDescriptionOn: undefined,
      removeClickListener: () => undefined,
      errorLoading: false,
    }

    this.showDescirption = this.showDescirption.bind(this)
    this.updateEvents = this.updateEvents.bind(this)
    this.incrementStartDate = this.incrementStartDate.bind(this)
  }

  showDescirption(eventId, element) {
    this.state.removeClickListener()
    this.setState({showDescriptionOn: eventId}, () => {
      if (element) {
        const removeClickListener = hideOnClickOutside(
          element, () => this.setState({showDescriptionOn: null})
        )
        this.setState({
          removeClickListener: removeClickListener
        })
      }
    })
  }

  incrementStartDate(increment) {
    this.setState(prevState => ({
      startDate: addDays(prevState.startDate, increment)
    }), () => this.updateEvents())

  }

  updateEvents() {
    const startDate = this.state.startDate
    const endDate = addDays(startDate, 7)
    getEvents(this.state.startDate, endDate).then(
      result => {
       this.setState({
        events: [...result.items
          .filter(e => !(e.status === 'cancelled'))
          .reduce(
            (acc, event) => {
              try {
                acc.push(parseEvent(event))
              } catch {
              }
              return acc}, []
          )]}
        )
      },
      (error) => this.setState({errorLoading: true})
    )
  }

  componentDidMount() {
    this.updateEvents()
  }

  render() {
    const startDate = this.state.startDate
    const endDate = addDays(startDate, 7)
    const events = this.state.events.map(e => ({
      ...e,
      descriptionVisible: e.id === this.state.showDescriptionOn,
      showDescirption: (element) => this.showDescirption(e.id, element),
      hideDescription: () => this.showDescirption(),
    }))
    const eventsByDate = splitEventsByDate(
      events,
      startDate,
      endDate
    ).slice(0, 7)
    
    const dayCols = eventsByDate.map(
      d => (
        <DayColumn date={d[0]} events={d[1]} key={d}/>
      )
    )
    return (
      <>
      <WeekSwitcher startDate={startDate} endDate={endDate}
        incrementDate={this.incrementStartDate}/>
      <div className='calendar'>
        {dayCols}
      </div>
      {this.state.errorLoading
        ? <p className='loading-error'>
            Вибачте, не вдалося завантажити події, дивіться у <GoogleCalendarLink text='Google Календарі'/>
          </p>
        : <p className='google-cal-link'><GoogleCalendarLink/></p>
      }
      </>
    )
  }
}


class Event extends React.Component {
  constructor(props) {
    super(props)
    this.descriptionElement = React.createRef()
  }

  render() {
    const {
      summary, description, startDT, endDT,
      showDescirption, descriptionVisible, hideDescription
    } = this.props.event
    const timeClass = 'calendar__event-time ' +
      (descriptionVisible? 'calendar__event-time_em' : '')
    return (
      <article className="calendar__event">
        <h3 className="calendar__event-title" onClick={() => {
          showDescirption(this.descriptionElement.current)
        }}>{summary}</h3>
        <p className={timeClass}>{
          formatTime(startDT)} - {formatTime(endDT)}
        </p>
        <EventDescription summary={summary} description={description}
          hide={hideDescription} hidden={!descriptionVisible}
          elementRef={this.descriptionElement}/>
      </article>
    )
  }
}


function EventDescription({summary, description, hidden, hide, elementRef}) {
  const className = "calendar__event-description "
    + (hidden? "calendar__event-description_hidden" : "")
  return (
    <div className={className} ref={elementRef}>
      <h3 className="calendar__event-description-title">{summary}</h3>
      <p className="calendar__event-description-text">{description}</p>
      <div onClick={hide} className="calendar__close-event-descr-btn" title='закрити'>×</div>
    </div>
  )
}

function DayPartBlock({name, events, dow}) {
  const className = `calendar__slot calendar__slot_day_${dow} calendar__slot_${name}`
  const eventEls = events.map(e => <Event key={e.id} event={e}/>)
  return <div className={className}>
    {eventEls}
  </div>
}


function DayColumn({date, events}) {
  const dow = date.getDay()
  const dowName = DOWs[dow]
  const eventsByDaypart = splitEventsByDaypart(events)
  const dpEls = eventsByDaypart.map(
    item => <DayPartBlock name={item[0]} key={item[0]} events={item[1]} dow={dow}/>
  )

  const dayClassName = 'calendar__slot_day_' + dow
  const className = "calendar__slot " + dayClassName
  return (
  <>
    <div className={className + " calendar__slot_label"}>
      <h3 className="calendar__dow_title">{dowName}</h3>
      <p className="calendar__date">{formatDate(date)}</p>
    </div>
    {dpEls}
  </>)
}