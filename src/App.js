import React, { Component } from 'react';
import RichTextEditor from './RichTextEditor'
// import RichTextEditor from './color'


class App extends Component {
  render() {
    return (
      <div className="App" style={{margin: '20px'}}>
        <RichTextEditor />
      </div>
    );
  }
}

export default App;
