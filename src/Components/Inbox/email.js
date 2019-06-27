import React from 'react'
import '../../Styles/Inbox/email.css'

class Email extends React.Component {
  constructor(props) {
    super(props)

    this.setReply = this.setReply.bind(this)

    this.state = {
      attachments: [],
      reply: false,
      message: '',
    }
  }

  componentDidMount() {
    this.getPresignedURL()
  }

  setMessage(e) {
    const value = e.target.value

    this.setState((state, prop) => (
      Object.assign({}, state, {
        message: value,
      })
    ))

  }

  setReply(e, name) {
    this.props.openForm()
    document.getElementById("emailReceiver").value = this.props.email.sender.username
  }

  getPresignedURL() {
    fetch(`http://ec2-13-57-223-124.us-west-1.compute.amazonaws.com/emails/attachments/?email_id=${this.props.email.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    }).then(res => {
      return res.json()
    }).then(json => {
      this.setState((state, props) => (
        Object.assign({}, state, json)
      ))
    })
  }

  downloadAttachment(presignedUrl) {
    fetch(presignedUrl).then(res => {
      return res
    })
  }

  render() {
    const { email, parseTime } = this.props
    const timeFormat = parseTime(email.created_at)
    const attachments = this.state.attachments.length === 0 ? ''
        : this.state.attachments.map((attachment) => (
          <a
            key={attachment[Object.keys(attachment)[0]]}
            href={attachment[Object.keys(attachment)[0]]}
            className="email-attachment-name">
            { Object.keys(attachment)[0] }
          </a>
        ))
    console.log(attachments)
    return (
      <div className="email-container">
        <div className="email-content">
          <h2 className="email-subject">
            { email.subject }
          </h2>
          <div className="email-sender-info">
            <h5>
              { email.sender.username }
            </h5>
            <div>
              { timeFormat.date },&nbsp;
              { timeFormat.year },&nbsp;
              { timeFormat.time }
            </div>
          </div>
          <pre className="email-message">
            { email.message }
          </pre>
        </div>
        <div className="email-attachment-list">
          { attachments }
        </div>
        <div className="email-options">
          <div className="email-reply-wrapper">
            <div
              className="reply"
              onClick={this.setReply}>
              <i className="material-icons">reply</i>
              Reply
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Email;
