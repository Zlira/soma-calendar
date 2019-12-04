import React from 'react'

import GoogleCalendarLink from './GoogleCalendarLink'


export default class ErrorBoundry extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false
    }
  }
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <p className='epic-fail-error'>
        Щось пішло не так :( Але в нас є ще <GoogleCalendarLink text="Google Календар"/>
      </p>;
    }
    return this.props.children;
  }
}