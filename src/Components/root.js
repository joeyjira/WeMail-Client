import React from 'react';
import Authentication from './Authentication/authentication.js';
import Inbox from './Inbox/inbox.js'

class Root extends React.Component {
  constructor(props) {
    super(props)
    this.setCurrentUser = this.setCurrentUser.bind(this)
    this.verifyCurrentUser = this.verifyCurrentUser.bind(this)
    this.state = {
      isAuthorized: false,
    }
  }

  componentDidMount() {
    this.verifyCurrentUser()
  }

  setCurrentUser(authorized) {
    this.setState((state, props) => (
      Object.assign({}, state, {isAuthorized: authorized})
    ))
  }

  verifyCurrentUser() {
    fetch('http://ec2-13-57-223-124.us-west-1.compute.amazonaws.com/emails/current-user/', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(res => {
      const authorizedStatus = res.status === 200
      this.setCurrentUser(authorizedStatus)
		  return res.json()
	  })
    .then(json => {
      this.setState((state, props) => (
        Object.assign({}, state, json)
      ))
    })
  }

  handleTextChange(e) {
    const name = e.target.id;
    const value = e.target.value;

    this.setState((state, props) => (
      Object.assign({}, state, {[name]: value})
    ))
  }

  render() {
    const isAuthorized = this.state.isAuthorized

    return (
      isAuthorized
        ? <Inbox
            setCurrentUser={ this.setCurrentUser } />
        : <Authentication
            textChange={ this.handleTextChange }
            verifyCurrentUser={ this.verifyCurrentUser }
            setCurrentUser={ this.setCurrentUser } />
    )
  }
}

export default Root;
