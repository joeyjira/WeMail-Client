import React from 'react';
import SignIn from './signIn.js';
import SignUp from './signUp.js';
import '../../Styles/Authentication/authentication.css';

class Authentication extends React.Component {
  constructor() {
    super()
    this.state = {
      hasAccount: true,
    }
  }

  toggleHasAccount() {
    const hasAccount = this.state.hasAccount;

    this.setState({
      hasAccount: !hasAccount,
    })
  }

  render() {
    const hasAccount = this.state.hasAccount;
    const { textChange, verifyCurrentUser } = this.props

    return (
      <div className="authentication-container">
        { hasAccount
          ? <SignIn
              onClick={ () => this.toggleHasAccount() }
              textChange={ textChange }
              verifyCurrentUser={ verifyCurrentUser } />
          : <SignUp
              onClick={ () => this.toggleHasAccount() }
              textChange={ textChange }
              verifyCurrentUser={ verifyCurrentUser } /> }
      </div>
    )
  }
}

export default Authentication;
