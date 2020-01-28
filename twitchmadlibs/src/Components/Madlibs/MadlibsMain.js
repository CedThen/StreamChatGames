import React from "react";
import DisplayMsgs from "../DisplayMsgs";
import StreamConnectionBox from "../StreamConnectionBox/StreamConnectionBox";
import "./MadlibsMain.scss";

const socketURL = "ws://localhost:3030";

class MadlibsHome extends React.Component {
  state = {
    chatTimer: 30,
    streamUrl: "",
    msgs: [],
    showStreamBox: true
  };
  ws = new WebSocket(socketURL);

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

  onStreamChange = event => {
    this.setState({ streamUrl: event.target.value });
  };

  onTimerChange = event => {
    this.setState({ chatTimer: event.target.value });
  };

  onSubmitStreamClick = () => {
    console.log("submit clicked, stream is: ", this.state.streamUrl);
    const streamBoxWsMsg = JSON.stringify({
      type: "setupConfig",
      payload: {
        streamUrl: this.state.streamUrl,
        inputTimer: this.state.chatTimer
      }
    });
    this.ws.send(streamBoxWsMsg);
    this.setState({ showStreamBox: false });
  };

  openSocketConnection = () => {};

  render() {
    return (
      <div className="madlibs__main">
        <h1 className="madlibs__title">Twitch chat games</h1>
        {this.state.showStreamBox ? (
          <StreamConnectionBox
            onStreamChange={this.onStreamChange}
            onSubmitStreamClick={this.onSubmitStreamClick}
            onTimerChange={this.onTimerChange}
            chatTimer={this.state.chatTimer}
            streamUrl={this.state.streamUrl}
          />
        ) : (
          <div className="madlibs__stream-name">{this.state.streamUrl}</div>
        )}
      </div>
    );
  }
}

export default MadlibsHome;
