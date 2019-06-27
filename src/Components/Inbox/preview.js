import React from 'react'
import '../../Styles/Inbox/preview.css'

class Preview extends React.Component {
  render() {
    const { email, index, openEmail, parseTime, handleSelection, checked } = this.props
    const timeFormat = parseTime(email.created_at)
    const containerClass = email.read ?
        "preview-container hover-pointer preview-read" : "preview-container hover-pointer"

    return (
      <div
        className={containerClass}>
        <label className="checkbox">
          <input
            type="checkbox"
            className="filled-in"
            checked={checked}
            onChange={(e) => handleSelection(e, email.id)} />
          <span className="checkbox"></span>
        </label>
        <div
          className="preview-email"
          onClick={() => openEmail(index)}>
          <div className="preview-sender">
            <div className="ellipsis">{ email.sender.username }</div>
          </div>
          <div className="preview-row">
            <div className="preview-subject ellipsis">{ email.subject }</div>
            <div>&nbsp;-&nbsp;</div>
            <div className="preview-message ellipsis">{ email.message }</div>
          </div>
          <div className="preview-date ellipsis">
            {timeFormat.date}
            &nbsp;&nbsp;
            { timeFormat.time }
          </div>
        </div>
      </div>
    )
  }
}

export default Preview
