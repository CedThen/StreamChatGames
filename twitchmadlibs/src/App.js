import React from "react";
import DisplayMsgs from "./DisplayMsgs";
import "./App.css";

const URL = "ws://localhost:3030";

class App extends React.Component {
  state = {
    msgs: []
  };
  ws = new WebSocket(URL);

  componentDidMount() {
    this.ws.onopen = () => {
      console.log("connected");
    };
    this.ws.onmessage = event => {
      this.setState({ msgs: [...this.state.msgs, event.data] });

      console.log(this.state.msgs);
    };

    this.ws.onclose = () => {
      console.log("disconnected");
    };
  }
  render() {
    return (
      <div className="App">
        <header className="App-header"></header>
        <h1>Twitch chat games</h1>
        New Messages:
        <DisplayMsgs msgs={this.state.msgs} />
      </div>
    );
  }
}

export default App;
