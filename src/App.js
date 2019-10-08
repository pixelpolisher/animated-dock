import React, { Component } from 'react';
import Dock from './Dock';

import './css/style.css';

class App extends Component {

  render() {
    return (
      <div className="App">
        <main className="main">
          <Dock />
        </main>
      </div>
    );
  }
}

export default App;
