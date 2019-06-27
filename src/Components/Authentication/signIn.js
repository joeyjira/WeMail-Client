import React from 'react';
import '../../Styles/Authentication/signIn.css';

class SignIn extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      errors: {},
    }
  }

  handleSignIn(e) {
    e.preventDefault()
    fetch('http://ec2-13-57-223-124.us-west-1.compute.amazonaws.com/emails/token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      })
    })
    .then(res => res.json())
    .then(json => {
      this.setState((state, props) => (
        Object.assign({}, state, {errors: {
          non_field_errors: json.non_field_errors,
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
    const { onClick } = this.props;

    const authenticationError = this.state.errors.non_field_errors ? (
      <div className="error">{ this.state.errors.non_field_errors }</div>
    ) : ''

    return (
      <div className="signin-container">
        <div>
          <form className="col">
            <div className="row">
              <div className="input-field">
                <input
                  id="username"
                  type="text"
                  className="validate"
                  onChange={(e) => this.handleTextChange(e)} />
                <label htmlFor="username">Username</label>
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
                { authenticationError }
              </div>
            </div>
          </form>
        </div>
        <div className="registration-choice">
          <div className="signup" onClick={onClick}>Create Account</div>
          <button
            className="signin waves-effect waves-light btn"
            onClick={(e) => this.handleSignIn(e)}>Sign In</button>
        </div>
      </div>
    )
  }
}

export default SignIn;
