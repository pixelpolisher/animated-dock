import React, { Component } from 'react';
import Dock from './Dock';

import './css/style.css';

class App extends Component {

  render() {
    return (
      <main className="main">
        <Dock />
      </main>
    );
  }
}

export default App;
