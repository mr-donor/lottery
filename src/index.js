import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  render() {
    return (
      <div style={{ color: 'red', fontSize: '18px' }}>
        <h1>Hello, World!</h1>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));