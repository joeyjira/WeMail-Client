import React from 'react';
import '../../Styles/Authentication/signUp.css';

class SignUp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      first_name: '',
      last_name: '',
      username: '',
      password: '',
      confirm: '',
      errors: {},
    }
  }

  handleRegistration(e) {
    e.preventDefault()

    fetch('http://ec2-13-57-223-124.us-west-1.compute.amazonaws.com/emails/registration/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        username: this.state.username,
        password: this.state.password,
        confirm: this.state.confirm,
      })
    })
    .then(res => res.json())
    .then(json => {
      this.setState((state, props) => (
        Object.assign({}, state, {errors: {
          'usernameError': json.usernameError,
          'password': json.password,
          'confirmError': json.confirmError,
        }})
      ))
      localStorage.setItem('token', json.token)
      this.props.verifyCurrentUser()
    })
    .catch(e => console.log(e))
  }

  handleTextChange(e) {
    this.props.textChange.call(this, e)
  }

  render() {
    const { onClick } = this.props

    const usernameError = this.state.errors.usernameError ? (
      <div className="error">{ this.state.errors.usernameError }</div>
    ) : ''

    const passwordError = this.state.errors.password ? (
      <div className="error">{ this.state.errors.password }</div>
    ) : ''

    const confirmError = this.state.errors.confirmError ? (
      <div className="error">{ this.state.errors.confirmError }</div>
    ) : ''

    return (
      <div className="signup-container">
        <div>
          <form>
            <div className="flex-row-space-between">
              <div className="input-field signup-firstname">
                <input
                  id="first_name"
                  type="text"
                  className="validate"
                  onChange={(e) => this.handleTextChange(e)} />
                <label htmlFor="first_name">First Name</label>
              </div>
              <div className="input-field signup-lastname">
                <input
                  id="last_name"
                  type="text"
                  className="validate"
                  onChange={(e) => this.handleTextChange(e)} />
                <label htmlFor="last_name">Last Name</label>
              </div>
            </div>
            <div className="row">
              <div className="input-field">
                <input
                  id="username"
                  type="text"
                  className="validate"
                  onChange={(e) => this.handleTextChange(e)} />
                <label htmlFor="username">Username</label>
                { usernameError }
              </div>
            </div>
            <div className="row">
              <div className="input-field">
                <input
                  id="password"
                  type="password"
                  className="validate"
                  onChange={(e) => this.handleTextChange(e)} />
                <label htmlFor="password">Password</label>
                { passwordError }
              </div>
            </div>
            <div className="row">
              <div className="input-field">
                <input
                  id="confirm"
                  type="password"
                  className="validate"
                  onChange={(e) => this.handleTextChange(e)} />
                <label htmlFor="confirm">Confirm</label>
                { confirmError }
              </div>
            </div>
          </form>
        </div>
        <div className="registration-choice">
          <div className="registration-choice" onClick={onClick}>Sign in instead</div>
          <button
            className="signin waves-effect waves-light btn"
            onClick={(e) => this.handleRegistration(e)}>Register</button>
        </div>
      </div>
    )
  }
}

export default SignUp;
