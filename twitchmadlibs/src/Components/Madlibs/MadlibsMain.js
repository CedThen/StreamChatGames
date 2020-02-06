import React from "react";
import DisplayMsgs from "../DisplayMsgs/DisplayMsgs";
import StreamConnectionBox from "../StreamConnectionBox/StreamConnectionBox";
import "./MadlibsMain.scss";
import GameLibraryDisplay from "../GameLibraryDisplay/GameLibraryDisplay";
import GameDisplay from "../GameDisplay/GameDisplay";

const socketURL = "ws://localhost:3030";

class MadlibsHome extends React.Component {
  constructor() {
    super();
    this.state = {
      chatTimer: 30,
      streamUrl: "",
      latestMsg: "",
      showStreamBox: true,
      gameObjectLibrary: [],
      currentGameObject: null,
      rankedMsgs: [],
      allMsgsLib: {}
    };
    this.ws = new WebSocket(socketURL);
    this.ws.onopen = () => {
      console.log("connected");
      this.ws.send(
        JSON.stringify({
          type: "getMadlibLibrary"
        })
      );
    };
    this.ws.onmessage = this.wsMessageHandler;
    this.ws.onclose = () => {
      console.log("disconnected");
    };
  }

  addMsgsToLib = newMsg => {
    let { allMsgsLib } = this.state;
    if (allMsgsLib[newMsg]) {
      const updatedChatMsgs = allMsgsLib;
      updatedChatMsgs[newMsg]++;
      this.setState({ allMsgsLib: updatedChatMsgs });
      this.compareAndRankMsgs(newMsg, true);
    } else {
      const updatedChatMsgs = allMsgsLib;
      allMsgsLib[newMsg] = 1;
      this.setState({ allMsgsLib: updatedChatMsgs });
      this.compareAndRankMsgs(newMsg, false);
    }
  };

  compareAndRankMsgs = (newMsg, seenBefore) => {
    let { allMsgsLib, rankedMsgs } = this.state;
    const newMsgObj = {
      msg: newMsg,
      count: allMsgsLib[newMsg]
    };
    if (rankedMsgs.length === 0) {
      //add first one to array
      this.setState({ rankedMsgs: [newMsgObj] });
    } else {
      //rankedmsgs length > 0
      if (seenBefore) {
        for (let i = 0; i <= rankedMsgs.length - 1; i++) {
          if (allMsgsLib[newMsg] > rankedMsgs[i].count) {
            //if newMsg count is greater than current array item, add newobj, remove any duplicates
            rankedMsgs.splice(i, 0, newMsgObj);
            for (let j = i + 1; j < rankedMsgs.length; j++) {
              if (newMsg === rankedMsgs[j].msg) {
                rankedMsgs.splice(j, 1);
              }
            }
            if (rankedMsgs.length > 10) {
              //make sure max length is 10
              rankedMsgs.pop();
            }
            this.setState({ rankedMsgs: rankedMsgs });
            break;
          }
        }
      } else {
        //not seen before
        if (rankedMsgs.length < 10) {
          //add to end
          let tempRankedMsgs = rankedMsgs.concat(newMsgObj);
          this.setState({ rankedMsgs: tempRankedMsgs });
        }
      }
    }
  };

  wsMessageHandler = message => {
    let wsMsg = JSON.parse(message.data);
    console.log("parsed ws msg: ", wsMsg);
    switch (wsMsg.type) {
      case "newMsg":
        this.setState(() => {
          return { latestMsg: wsMsg.payload };
        });
        this.addMsgsToLib(wsMsg.payload);
        break;
      case "madlibLibraryJson":
        this.setState({ gameObjectLibrary: wsMsg.payload });
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
  };

  onGameBeginClick = () => {
    if (this.state.streamUrl === "") {
      alert("Please enter your stream information");
      return;
    }
    let gameBeginMsg = {
      type: "beginGame"
    };
    console.log("begin game msg: ");
    this.ws.send(JSON.stringify(gameBeginMsg));
  };

  onRestartGameClick = () => {
    //todo
  };

  onReturnLibClick = () => {
    this.resetChatStorage();
    this.setState({ currentGameObject: null });
  };

  stopListeningChatInput() {
    const stopListeningMsg = {
      payload: "stopListening"
    };
    this.ws.send(JSON.stringify(stopListeningMsg));
  }

  resetChatStorage = () => {
    this.setState({
      rankedMsgs: [],
      allMsgsLib: {}
    });
  };

  onStreamConnectionResetClick = () => {
    this.setState({ streamUrl: "" });
    this.resetChatStorage();
    let streamResetMsg = {
      type: "streamReset"
    };
    this.ws.send(JSON.stringify(streamResetMsg));
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
            onStreamConnectionResetClick={this.onStreamConnectionResetClick}
          />
        ) : (
          <div
            className="madlibs__stream-name"
            onClick={this.toggleShowStreamConnectionBox}
          >
            {this.state.streamUrl}
          </div>
        )}
        {!this.state.currentGameObject ? (
          <GameLibraryDisplay
            gameObjectLibrary={this.state.gameObjectLibrary}
            onGameTitleClick={this.onGameTitleClick}
          />
        ) : (
          <GameDisplay
            chatTimer={this.state.chatTimer}
            onRestartGameClick={this.onRestartGameClick}
            currentGameObject={this.state.currentGameObject}
            onGameBeginClick={this.onGameBeginClick}
            onReturnLibClick={this.onReturnLibClick}
          />
        )}
        <DisplayMsgs
          latestMsg={this.state.latestMsg}
          rankedMsgs={this.state.rankedMsgs}
        />
      </div>
    );
  }
}

export default MadlibsHome;
