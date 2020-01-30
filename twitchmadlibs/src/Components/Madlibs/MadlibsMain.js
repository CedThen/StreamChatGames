import React from "react";
import DisplayMsgs from "../DisplayMsgs";
import StreamConnectionBox from "../StreamConnectionBox/StreamConnectionBox";
import "./MadlibsMain.scss";
import GameLibraryDisplay from "../GameLibraryDisplay/GameLibraryDisplay";

const socketURL = "ws://localhost:3030";

class MadlibsHome extends React.Component {
  state = {
    chatTimer: 30,
    streamUrl: "",
    msgs: [],
    showStreamBox: true,
    gameObjectLibrary: [],
    currentGameObject: {}
  };
  ws = new WebSocket(socketURL);

  componentDidMount() {
    this.ws.onopen = () => {
      console.log("connected");
      this.ws.send(JSON.stringify(getMadlibLibrary));
    };
    this.ws.onmessage = this.wsMessageHandler;
    this.ws.onclose = () => {
      console.log("disconnected");
    };
    const getMadlibLibrary = {
      type: "getMadlibLibrary"
    };
  }

  wsMessageHandler = message => {
    let wsMsg = JSON.parse(message.data);
    console.log("parsed ws msg: ", wsMsg);
    switch (wsMsg.type) {
      case "newMsg":
        this.setState({ msgs: [...this.state.msgs, wsMsg.payload] });
        console.log(this.state.msgs);
        break;
      case "madlibLibraryJson":
        console.log("receiving json");
        this.setState({ gameObjectLibrary: wsMsg.payload });
        console.log(this.state.gameObjectLibrary);
        break;
      default:
        break;
    }
  };

  onStreamChange = event => {
    this.setState({ streamUrl: event.target.value });
  };

  onTimerChange = event => {
    this.setState({ chatTimer: event.target.value });
  };

  onSubmitStreamClick = event => {
    console.log("submit clicked, stream is: ", this.state.streamUrl);
    if (this.state.streamUrl === "") {
      alert("Please enter a valid url");
    } else {
      const streamBoxWsMsg = JSON.stringify({
        type: "setupConfig",
        payload: {
          streamUrl: this.state.streamUrl,
          inputTimer: this.state.chatTimer
        }
      });
      this.ws.send(streamBoxWsMsg);
      this.setState({ showStreamBox: false });
    }
  };

  toggleShowStreamConnectionBox = () => {
    this.setState({ showStreamBox: !this.state.showStreamBox });
  };

  onGameTitleClick = index => {
    this.setState({ currentGameObject: this.state.gameObjectLibrary[index] });
    console.log(this.state.currentGameObject);
  };
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
          <div
            className="madlibs__stream-name"
            onClick={this.toggleShowStreamConnectionBox}
          >
            {this.state.streamUrl}
          </div>
        )}
        <GameLibraryDisplay
          gameObjectLibrary={this.state.gameObjectLibrary}
          onGameTitleClick={this.onGameTitleClick}
        />
      </div>
    );
  }
}

export default MadlibsHome;
