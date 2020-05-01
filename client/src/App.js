import React from 'react';
import './App.css'
import { subscribeToUsers, emitPosition } from './api';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      users: {}
    }
    window.addEventListener('mousemove', (e) => {
      let pos = { x: e.clientX, y: e.clientY }
      emitPosition(pos)
    })

    let me = this;
    subscribeToUsers(function (err, users) {
      me.setState({ users: users })
    });
  }

  render() {
    let userItems = Object.keys(this.state.users).map((key, i) => {
      let user = this.state.users[key]
      const userStyle = {
        transform: `translateX(${user.position.x}px) translateY(${user.position.y}px)`
      }
      return (<span class='cursor' style={userStyle} key={i}>{user.id}</span>)
    })

    return (
      <>
        {userItems}
      </>
    );
  }
}

export default App;
