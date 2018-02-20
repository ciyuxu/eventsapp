import React, { Component } from "react";
import logo from "./logo.svg";
import getQueryParam from "./getQueryParam";
import toQueryString from "./toQueryString";
import "./App.css";

function getRandomString() {
  let string = "";
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
  const numCharacters = characters.length;
  for (let i = 0; i < 32; i++) {
    string += characters.charAt(Math.random() * numCharacters);
  }
  return string;
}

function getNonce() {
  const nonce = getRandomString();
  localStorage.setItem("nonce", nonce);
  return nonce;
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = { accessToken: getQueryParam("access_token"), events: [] };
  }

  async componentDidMount() {
    const { accessToken } = this.state;
    if (accessToken) {
      const endpoint =
        "https://graph.microsoft.com/v1.0/me/events?$select=subject,body,bodyPreview,organizer,attendees,start,end,location";
      try {
        const response = await fetch(endpoint, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });
        if (!response.ok) {
          throw new Error(
            `Request failed with status code ${response.status}: ${
              response.statusText
            }`
          );
        }

        const data = await response.json();
        this.setState({ events: data.value });
      } catch (error) {
        alert(`There was an error fetching the calendars: ${error}`);
      }
    }
  }

  render() {
    return (
      <React.Fragment>
        <nav className="navbar navbar-inverse navbar-fixed-top">
          <div className="container">
            <div className="navbar-header">
              <button
                type="button"
                className="navbar-toggle collapsed"
                data-toggle="collapse"
                data-target="#navbar"
                aria-expanded="false"
                aria-controls="navbar"
              >
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar" />
                <span className="icon-bar" />
                <span className="icon-bar" />
              </button>
              <a className="navbar-brand" href="#">
                Events APP
              </a>
            </div>
            <div id="navbar" className="navbar-collapse collapse">
              <ul className="nav navbar-nav authed-nav">
                <li id="home-nav">
                  <a href="#">Home</a>
                </li>
                <li id="inbox-nav">
                  <a href="#inbox">Inbox</a>
                </li>
              </ul>
              {this.state.accessToken ? (
                <ul className="nav navbar-nav navbar-right authed-nav">
                  <li>
                    <a href="#signout">Sign out</a>
                  </li>
                </ul>
              ) : null}
            </div>
          </div>
        </nav>

        <div className="container main-container">
          <div id="signin-prompt" className="jumbotron page">
            <h1>Events APP</h1>
            {/* <p>
              This example shows how to get an OAuth token from Azure using the
              <a href="https://azure.microsoft.com/en-us/documentation/articles/active-directory-v2-protocols-implicit/">
                implicit grant flow
              </a>{" "}
              and to use that token to make calls to the Outlook APIs.
            </p> */}

            <p>
              <a
                className="btn btn-lg btn-primary"
                onClick={this._signIn}
                role="button"
                id="connect-button"
              >
                Connect to Outlook
              </a>
            </p>

            {this.state.events.map(calendarData => (
              <div key={calendarData.id} className="events_container">
                <p>Time: {calendarData.start.dateTime}</p>
                <p>Location: {calendarData.location.displayName}</p>
                <p>Description: {calendarData.bodyPreview}</p>
              </div>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }

  _signIn = () => {
    const endpoint =
      "https://login.microsoftonline.com/common/oauth2/v2.0/authorize";
    const params = {
      client_id: "e3a83b7d-7447-4689-ae97-41488d5b215f",
      response_type: "id_token token",
      redirect_uri: "http://localhost:3000/",
      scope: "openid https://graph.microsoft.com/calendars.read",
      response_mode: "fragment",
      nonce: getNonce()
    };
    window.location = `${endpoint}?${toQueryString(params)}`;
  };
}

export default App;
