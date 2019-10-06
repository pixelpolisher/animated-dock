import React, { Component } from 'react';
import Dock from './Dock';

import './css/style.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <main className="main">
          <h1>Animated dock</h1>
          <p>
            Originally built in flash in 2007, this version uses react and css.
          </p>
          <Dock />
        </main>
      </div>
    );
  }
}

export default App;
