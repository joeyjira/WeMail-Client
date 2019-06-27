import React from 'react'

import Preview from './preview.js'
import Email from './email.js'
import '../../Styles/Inbox/inbox.css'

import parseTime from '../../Utility/time.js'

class Inbox extends React.Component {
  constructor(props) {
    super(props)

    this.openEmail = this.openEmail.bind(this)
    this.openForm = this.openForm.bind(this)
    this.closeEmail = this.closeEmail.bind(this)
    this.parseTime = parseTime.bind(this)
    this.setAttachment = this.setAttachment.bind(this)
    this.removeAttachment = this.removeAttachment.bind(this)
    this.setReceiver = this.setReceiver.bind(this)
    this.getInbox = this.getInbox.bind(this)
    this.getSent = this.getSent.bind(this)
    this.getStarred = this.getStarred.bind(this)
    this.getTrash = this.getTrash.bind(this)
    this.handleStarred = this.handleStarred.bind(this)
    this.handleRecover = this.handleRecover.bind(this)
    this.handleDelete = this.handleDelete.bind(this)
    this.handleSelection = this.handleSelection.bind(this)
    this.handleSelectAll = this.handleSelectAll.bind(this)

    this.state = {
      inbox: [],
      compose: {
        subject: '',
        message: '',
        receiver: {
          username: ''
        },
      },
      attachments: [],
      openEmail: false,
      option: 'inbox',
      mailIndex: -1,
      selection: {},
    }
  }

  componentWillMount() {
    this.getInbox()
  }

  getInbox() {
    fetch('https://wemail.surf/emails/inbox/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    }).then(res => {
		  return res.json()
	  }).then(json => {
      this.setState((state, prop) => (
        Object.assign({}, state, json, {
          openEmail: false,
        })
      ))
    })
  }

  getSent() {
    fetch('https://wemail.surf/emails/sent/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    }).then(res => {
		  return res.json()
	  }).then(json => {
      this.setState((state, prop) => (
        Object.assign({}, state, json, {
          openEmail: false,
        })
      ))
    })
  }

  getStarred() {
    fetch('https://wemail.surf/emails/starred/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
    .then(res => {
		  return res.json()
	  }).then(json => {
      this.setState((state, prop) => (
        Object.assign({}, state, json, {
          openEmail: false,
        })
      ))
    })
  }

  getTrash() {
    fetch('https://wemail.surf/emails/trash/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      }
    })
    .then(res => {
		  return res.json()
	  }).then(json => {
      this.setState((state, prop) => (
        Object.assign({}, state, json, {
          openEmail: false,
        })
      ))
    })
  }

  openForm() {
    document.getElementById("myForm").style.display = "block"
  }

  closeForm() {
    document.getElementById("myForm").style.display = "none"
  }

  toggleForm() {
    const element = document.getElementById("emailForm")
    const style = getComputedStyle(element)

    if (style.display === "none") {
      element.style.display = "block"
    } else {
      element.style.display = "none"
    }
  }

  selectNavOption(e) {
    const inboxOption = document.getElementById("inboxOption")
    const sentOption = document.getElementById("sentOption")
    const starredOption = document.getElementById("starredOption")
    const trashOption = document.getElementById("trashOption")
    const checkbox = document.getElementsByClassName("filled-in")

    if (e.target.id === "inboxOption") {
      this.getInbox()
      this.setState((state, prop) => (
        Object.assign({}, state, {
          option: 'inbox'
        }, {
          selection: {},
        })
      ))
      sentOption.classList.remove("inbox-option-selected")
      trashOption.classList.remove("inbox-option-selected")
      starredOption.classList.remove("inbox-option-selected")
      inboxOption.classList.add("inbox-option-selected")
    } else if (e.target.id === "sentOption") {
      this.getSent()
      this.setState((state, prop) => (
        Object.assign({}, state, {
          option: 'sent'
        }, {
          selection: {},
        })
      ))
      inboxOption.classList.remove("inbox-option-selected")
      trashOption.classList.remove("inbox-option-selected")
      starredOption.classList.remove("inbox-option-selected")
      sentOption.classList.add("inbox-option-selected")
    } else if (e.target.id === "starredOption") {
      this.getStarred()
      this.setState((state, prop) => (
        Object.assign({}, state, {
          option: 'starred'
        }, {
          selection: {},
        })
      ))
      inboxOption.classList.remove("inbox-option-selected")
      sentOption.classList.remove("inbox-option-selected")
      trashOption.classList.remove("inbox-option-selected")
      starredOption.classList.add("inbox-option-selected")
    } else if (e.target.id === "trashOption") {
      this.getTrash()
      this.setState((state, prop) => (
        Object.assign({}, state, {
          option: 'trash'
        }, {
          selection: {},
        })
      ))
      inboxOption.classList.remove("inbox-option-selected")
      sentOption.classList.remove("inbox-option-selected")
      starredOption.classList.remove("inbox-option-selected")
      trashOption.classList.add("inbox-option-selected")
    }

    for (let i = 0; i < checkbox.length; i++) {
      this.uncheck(checkbox[i])
    }
  }

  handleSignOut(e) {
    localStorage.removeItem('token');
    this.props.setCurrentUser(false);
  }

  handleSend(e) {
    e.preventDefault();
    let data = new FormData()

    data.append('email', JSON.stringify(this.state.compose))

    for (let file of this.state.attachments) {
      data.append('attachments', file, file.name)
    }

    fetch('https://wemail.surf/emails/inbox/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: data,
    })
    .then(res => {
      if (res.status === 400) {
        res.json().then(json => {
          if (json.hasOwnProperty('receiver')) {
            this.showSnackBar(json.receiver.username[0])
          } else if (json.subject) {
            this.showSnackBar("Subject field may not be blank...")
          } else if (json.message) {
            this.showSnackBar("Message field may not be blank...")
          }
        })
        return;
      }
      this.showSnackBar("Email sent!")
      this.clearCompose()
    })
  }

  handleStarred(e, ids, callback) {
    let url = "https://wemail.surf/emails/starred/?email_id="

    for (let i = 0; i < ids.length; i++) {
      url += ids[i]
      if (i !== ids.length - 1) url += ','
    }

    fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(res => {
      this.showSnackBar(ids.length > 1 ? ids.length + " Emails moved!" : ids.length + " Email moved")
      if (callback) callback()
    })
  }

  handleDelete(e, ids, callback) {
    let url = "https://wemail.surf/emails/inbox/?email_id="

    for (let i = 0; i < ids.length; i++) {
      url += ids[i]
      if (i !== ids.length - 1) url += ','
    }

    fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(res => {
      this.showSnackBar(ids.length > 1 ? ids.length + " Emails sent to trash" : ids.length + " Email sent to trash")
      if (callback) callback()
    })
  }

  handleDeleteSent(e, ids, callback) {
    let url = "https://wemail.surf/emails/sent/?email_id="

    for (let i = 0; i < ids.length; i++) {
      url += ids[i]
      if (i !== ids.length - 1) url += ','
    }

    fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(res => {
      this.getSent()
      if (callback) callback()
    })
  }

  handleRecover(e, ids, callback) {
    let url = "https://wemail.surf/emails/trash/?email_id="

    for (let i = 0; i < ids.length; i++) {
      url += ids[i]
      if (i !== ids.length - 1) url += ','
    }

    fetch(url, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(res => {
      this.showSnackBar(ids.length > 1 ? ids.length + " Emails recovered" : ids.length + " Email recovered")
      if (callback) callback()
    })
  }

  handleDeleteForever(e, ids, callback) {
    let url = "https://wemail.surf/emails/trash/?email_id="

    for (let i = 0; i < ids.length; i++) {
      url += ids[i]
      if (i !== ids.length - 1) url += ','
    }

    fetch(url, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
    .then(res => {
      this.showSnackBar(ids.length > 1 ? ids.length + " Emails deleted forever" : ids.length + " Email deleted forever")
      if (callback) callback()
    })

  }

  handleSelection(e, id) {
    let selected = this.state.selection

    if (selected.hasOwnProperty(id)) {
      delete this.state.selection[id]
    } else {
      selected[id] = id
    }

    this.setState((state, props) => (
      Object.assign({}, state, {
        selection: selected,
      })
    ))
  }

  handleSelectAll(e) {
    let checked = e.target.checked
    let selected = this.state.selection

    if (checked) {
      for (let i = 0; i < this.state.inbox.length; i++) {
        let email = this.state.inbox[i]
        selected[email.id] = email.id
      }
    } else {
      selected = {}
    }

    this.setState((state, props) => (
      Object.assign({}, state, {
        selection: selected,
      })
    ))
  }

  setReceiver(e) {
    let receiver = e.target.value

    this.setState((state, props) => (
      Object.assign({}, state, {
        compose: {
          receiver: {
            username: receiver,
          },
          subject: this.state.compose.subject,
          message: this.state.compose.message,
        }
      })
    ))
  }

  setReplyReceiver(e, name) {
    this.setState((state, props) => (
      Object.assign({}, state, {
        compose: {
          receiver: {
            username: name,
          },
          subject: this.state.compose.subject,
          message: this.state.compose.message,
        }
      })
    ))
  }

  setSubject(e) {
    const subject = e.target.value

    this.setState((state, props) => (
      Object.assign({}, state, {
        compose: {
          receiver: {
            username: this.state.compose.receiver.username,
          },
          subject: subject,
          message: this.state.compose.message,
        }
      })
    ))
  }

  setMessage(e) {
    const message = e.target.innerText

    this.setState((state, props) => (
      Object.assign({}, state, {
        compose: {
          receiver: {
            username: this.state.compose.receiver.username,
          },
          subject: this.state.compose.subject,
          message: message,
        }
      })
    ))
  }

  setAttachment(e) {
    const files = e.target.files

    this.setState((state, props) => (
      Object.assign({}, state, {
        attachments: [...files],
      })
    ))
  }

  removeAttachment(e, index) {
    const files = this.state.attachments
    files.splice(index, 1)

    console.log(this.state.attachments)

    this.setState((state, props) => (
      Object.assign({}, state, {
        attachments: files,
      })
    ))
  }

  clearCompose() {
    document.getElementById("emailReceiver").value = ''
    document.getElementById("emailSubject").value = ''
    document.getElementById("composeMessage").innerHTML = ''

    this.setState((state, props) => (
      Object.assign({}, state, {
        attachments: []
      })
    ))
  }

  openEmail(index) {
    const email = this.state.inbox[index]
    const checkbox = document.getElementsByClassName("filled-in")

    for (let i = 0; i < checkbox.length; i++) {
      this.uncheck(checkbox[i])
    }

    email.read = true

    fetch(`https://wemail.surf/emails/inbox/?email_id=${email.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify(email)
    }).then(res => {
      this.setState((state, prop) => (
        Object.assign({}, state, {
          openEmail: true,
          mailIndex: index,
        })
      ))
	  })
  }

  closeEmail() {
    this.setState((state, props) => (
      Object.assign({}, state, {
        openEmail: false,
        option: 'inbox',
      })
    ))
  }

  showSnackBar(text) {
    let snackBar = document.getElementById("snackbar");
    snackBar.innerHTML = text
    snackBar.className = "show";
    setTimeout(function() {
      snackBar.className = snackBar.className.replace("show", "")
    }, 3000);
  }

  uncheck(checkbox) {
    checkbox.checked = false;
  }

  setEmailOptions() {
    let options = <div></div>

    if (this.state.openEmail) {
      if (this.state.option === 'trash') {
        options =
          <div className="flex-row">
            <i
              className="material-icons hover-pointer hover-light margin8 paddding4 round-icon"
              onClick={this.closeEmail}>
              arrow_back
            </i>
            <div
              className="round-corner margin8 hover-light hover-pointer padding4"
              onClick={(e) => this.handleDeleteForever(e, [this.state.inbox[this.state.mailIndex].id], this.getTrash)}>
              Delete Forever
            </div>
            <div
              className="hover-pointer hover-light margin8 padding4 round-corner"
              onClick={(e) => this.handleRecover(e, [this.state.inbox[this.state.mailIndex].id])}>
              Recover
            </div>
          </div>

        return options
      } else if (this.state.option === 'sent') {
        options = <div className="flex-row">
          <i
            className="material-icons hover-pointer hover-light margin8 paddding4 round-icon"
            onClick={this.closeEmail}>
            arrow_back
          </i>
          <i
            className="material-icons hover-light hover-pointer margin8 paddding4"
            onClick={(e) => { this.handleDeleteSent(e, Object.values(this.state.selection), this.getSent)}}>
            delete
          </i>
        </div>

        return options
      }

      options =
        <div className="flex-row">
          <i
            className="material-icons hover-pointer hover-light margin8 paddding4 round-icon"
            onClick={this.closeEmail}>
            arrow_back
          </i>
          <i
            className="material-icons hover-pointer hover-light margin8 paddding4 round-icon"
            onClick={(e) => this.handleStarred(e, [this.state.inbox[this.state.mailIndex].id])}>
            star
          </i>
          <i
            className="material-icons hover-pointer hover-light margin8 round-icon"
            onClick={(e) => {
              this.handleDelete(e, [this.state.inbox[this.state.mailIndex].id], this.getInbox)
            }}>
            delete
          </i>
        </div>

      return options
    }

    switch (this.state.option) {
      case 'inbox':
        options =
          <div className="inbox-nav-option">
            <label className="checkbox margin8">
              <input
                type="checkbox"
                className="filled-in"
                onChange={ this.handleSelectAll }/>
              <span className="checkbox">Select All</span>
            </label>
            { Object.keys(this.state.selection).length === 0
                ? <div></div>
                :
                <div>
                  <i
                    className="material-icons hover-pointer hover-light margin8 round-icon"
                    onClick={(e) => {
                      this.handleStarred(e, Object.values(this.state.selection))
                    }}>
                    star
                  </i>
                  <i
                    className="material-icons hover-pointer hover-light margin8 round-icon"
                    onClick={(e) => {
                      this.handleDelete(e, Object.values(this.state.selection), this.getInbox)
                    }}>
                    delete
                  </i>
                </div>
            }
          </div>
        break
      case 'sent':
        options =
          <div className="inbox-nav-option">
            <label className="checkbox margin8">
              <input
                type="checkbox"
                className="filled-in"
                onChange={ this.handleSelectAll }/>
              <span className="checkbox">Select All</span>
            </label>
            { Object.keys(this.state.selection).length === 0
                ? <div></div>
                :
                <div>
                  <div
                    className="round-corner margin8 hover-light hover-pointer padding4"
                    onClick={(e) => this.handleDeleteSent(e, Object.values(this.state.selection), this.getSent)}>
                    Delete Selected Forever
                  </div>
                </div>
            }
          </div>
        break
      case 'starred':
        options =
          <div className="inbox-nav-option">
            <label className="checkbox margin8">
              <input
                type="checkbox"
                className="filled-in"
                onChange={ this.handleSelectAll }/>
              <span className="checkbox">Select All</span>
            </label>
            { Object.keys(this.state.selection).length === 0
                ? <div></div>
                :
                <div>
                  <i
                    className="material-icons hover-pointer hover-light margin8 round-icon"
                    onClick={(e) => {
                      this.handleStarred(e, Object.values(this.state.selection), this.getStarred)
                    }}>
                    star
                  </i>
                </div>
            }
          </div>
        break
      case 'trash':
        options =
          <div className="inbox-nav-option">
            <label className="checkbox margin8">
              <input
                type="checkbox"
                className="filled-in"
                onChange={ this.handleSelectAll } />
              <span className="checkbox">Select All</span>
            </label>
            { Object.keys(this.state.selection).length === 0
                ? <div></div>
                :
                <div className="flex-row">
                  <div
                    className="round-corner margin8 hover-light hover-pointer padding4"
                    onClick={(e) => this.handleDeleteForever(e, Object.values(this.state.selection), this.getTrash)}>
                    Delete Selected Forever
                  </div>
                  <div
                    className="round-corner margin8 hover-light hover-pointer padding4"
                    onClick={(e) => this.handleRecover(e, Object.values(this.state.selection), this.getTrash)}>
                    Recover Selected
                  </div>
                </div>
            }
          </div>
        break
      default:
        options = <div></div>
    }

    return options
  }

  render() {
    const emails = this.state.inbox.map((email, index) => (
      <Preview
        key={ index }
        email={ email }
        index={ index }
        openEmail={ this.openEmail }
        parseTime={ this.parseTime }
        handleSelection={ this.handleSelection }
        checked={ this.state.selection.hasOwnProperty(email.id) } />
    ))

    const attachments = this.state.attachments.length === 0 ? ''
        : this.state.attachments.map((attachment, index) => (
          <div
            key={ index }
            className="email-attachment-compose">
            { attachment.name }
            <i
              className="material-icons hover-pointer"
              onClick={(e) => this.removeAttachment(e, index)}>clear</i>
          </div>
        ))

    const menuOption = this.setEmailOptions();

    return (
      <div className="view-container">
        <div className="inbox-container">
          <div className="banner z-depth-2">
            <div className="logo-wrapper">
              <img
                className="inbox-logo"
                alt="WeMail Logo"
                src="./res/img/wemail.png"
                height="90px"
                width="90px"/>
              <h3 className="inbox-name">
                WeMail
              </h3>
            </div>
            <button
              className="waves-effect waves-light btn signout"
              onClick={(e) => this.handleSignOut(e)}>Sign Out
            </button>
          </div>
          <div className="nav-email-view">
            <div className="nav">
              <div className="compose-container">
                <div
                  className="waves-effect waves-light btn-large compose"
                  onClick={this.openForm}>
                  <i className="large material-icons add-icon">add</i>
                  <p>Compose</p>
                </div>
              </div>
              <div className="nav-options noselect">
                <div
                  className="inbox-option inbox-option-selected hover-pointer"
                  id="inboxOption"
                  onClick={(e) => this.selectNavOption(e)}>
                  <i className="material-icons material-icons-margin">inbox</i>
                  Inbox
                </div>
                <div
                  className="inbox-option hover-pointer"
                  id="sentOption"
                  onClick={(e) => this.selectNavOption(e)}>
                  <i className="material-icons material-icons-margin">send</i>
                  Sent
                </div>
                <div
                  className="inbox-option hover-pointer"
                  id="starredOption"
                  onClick={(e) => this.selectNavOption(e)}>
                  <i className="material-icons material-icons-margin">star</i>
                  Starred
                </div>
                <div
                  className="inbox-option hover-pointer"
                  id="trashOption"
                  onClick={(e) => this.selectNavOption(e)}>
                  <i className="material-icons material-icons-margin">delete</i>
                  Trash
                </div>
              </div>
            </div>
            <div className="flex">
              <div className="inbox-bar">
                { menuOption }
              </div>
              { this.state.inbox.length === 0
                ? <div className="inbox-empty">Currently no mail in {this.state.option}</div>
                :
                <div className="inbox-view">
                  { this.state.openEmail
                    ? <Email
                        email={this.state.inbox[this.state.mailIndex]}
                        parseTime= {this.parseTime}
                        openForm={this.openForm}
                        setReceiver={this.setReceiver} />
                    : emails }
                </div>
              }
            </div>
          </div>
        </div>
        <div className="email-popup z-depth-5" id="myForm">
          <div className="form-tab hover-pointer" onClick={ this.toggleForm }>
            <div>New Message</div>
            <div className="hover-pointer hover-grey" onClick={ this.closeForm }>
              <i className="material-icons">close</i>
            </div>
          </div>
          <form className="form-container" id="emailForm">
            <div className="sender-field flex-row">
              <div className="receiver-inner">
                To
              </div>
              <input
                id="emailReceiver"
                className="receiver-input"
                onChange={(e) => this.setReceiver(e)} />
            </div>
            <div className="subject-field flex-row">
              <div className="subject-inner">
                Subject
              </div>
              <input
                id="emailSubject"
                className="subject-input"
                onChange={(e) => this.setSubject(e)} />
            </div>
            <div
              id="composeMessage"
              className="message-field"
              contentEditable="true"
              onInput={(e) => this.setMessage(e)}>
            </div>
            <div className="email-attachment-list">
              { attachments }
            </div>
            <div className="preview-email-options">
              <button
                className="btn"
                onClick={(e) => this.handleSend(e)}>
                  Send
              </button>
              <div
                className="inbox-attachment">
                <label htmlFor="file-input">
                  <i className="material-icons hover-pointer">attach_file</i>
                </label>
                <input
                  type="file"
                  id="file-input"
                  name="Filedata"
                  className="inbox-input-file" multiple
                  onChange={(e) => this.setAttachment(e)}/>
              </div>
            </div>
          </form>
        </div>
        <div id="snackbar">...</div>
      </div>
    )
  }
}

export default Inbox
