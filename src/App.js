import React, { Component } from 'react';

import ErrorBoundry from './components/ErrorBoundry'
import Calendar from './components/Calendar.js'

class App extends Component {
  render() {
    return (
      <ErrorBoundry> <Calendar/> </ErrorBoundry>
    );
  }
}

export default App;