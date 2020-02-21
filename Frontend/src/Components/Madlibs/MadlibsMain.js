import React from "react";
import DisplayMsgs from "../DisplayMsgs/DisplayMsgs";
import StreamConnectionBox from "../StreamConnectionBox/StreamConnectionBox";
import "./MadlibsMain.scss";
import GameLibraryDisplay from "../GameLibraryDisplay/GameLibraryDisplay";
import GameDisplay from "../GameDisplay/GameDisplay";
import Navigation from "../Navbar/Navigation.js";
import ThreeJsBg from "../ThreeJSBackground.js";

const socketURL = "ws://localhost:3030";

class MadlibsHome extends React.Component {
  constructor() {
    super();
    this.state = {
      //stream connection box
      chatTimer: 30,
      streamUrl: "",
      showStreamBox: true,
      //chat display
      latestMsg: "",
      rankedMsgs: [],
      allMsgsLib: {},
      //game display
      gameObjectLibrary: [],
      //game control
      answerArray: [],
      currentGameObject: null,
      blankIndex: null,
      timeLeft: null,
      isGamePlaying: false,
      showResults: false
    };
    //websocket client setup
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
      console.log("disconnected from ws");
    };
    //close server-side streamconnection before page refresh/unload
    window.addEventListener("unload", () => {
      this.ws.send(JSON.stringify({ type: "streamReset" }));
    });
    //save timer as variable so it can be cleared later
    this.timer = null;
  }

  componentWillUnmount = () => {
    console.log("closing websocket connection");
    this.ws.close();
    // window.removeEventListener("unload");
  };

  addMsgsToLib = newMsgUntrimmed => {
    let { allMsgsLib } = this.state;
    const newMsg = newMsgUntrimmed.trim().toLowerCase();
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

  //msg objects structure
  // const newMsgObj = {
  //   msg: newMsg,
  //   count: allMsgsLib[newMsg]
  // };

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
    //initial game state
    this.setState({
      isGamePlaying: true
    });
    //begin game Path
    this.gamePath();
  };

  gamePath = () => {
    //reset chat status, set timer
    this.resetChatStorage();
    this.setState({
      timeLeft: this.state.chatTimer
    });
    if (this.state.blankIndex === null) {
      this.setState({ blankIndex: 0, timeLeft: this.state.chatTimer });
      this.gameLoop();
    } else {
      this.setState({
        blankIndex: this.state.blankIndex + 1,
        timeLeft: this.state.chatTimer
      });
      this.gameLoop();
    }
  };

  gameLoop = () => {
    let beginListenMsg = {
      type: "beginListen"
    };
    this.ws.send(JSON.stringify(beginListenMsg));
    this.timer = setInterval(() => {
      if (this.state.timeLeft > 1) {
        //decrements timer
        this.setState({ timeLeft: this.state.timeLeft - 1 });
      } else {
        this.stopListeningChatInput();

        //new object to add to answerArray
        let newAnswerArray = this.state.answerArray.concat(this.state.rankedMsgs[0].msg);

        //leave time at 0, add in newAnswer to the array
        this.setState({ timeLeft: 0, answerArray: newAnswerArray });

        clearInterval(this.timer);
      }
    }, 1000);
  };

  onNextClick = () => {
    this.gamePath();
  };

  onRestartGameClick = () => {
    this.stopListeningChatInput();
    this.resetGameState();
    this.resetChatStorage();
  };

  resetGameState = () => {
    this.setState({
      blankIndex: null,
      timeLeft: null,
      isGamePlaying: false,
      answerArray: [],
      showResults: false
    });
  };

  onReturnLibClick = () => {
    this.resetChatStorage();
    this.stopListeningChatInput();
    this.resetGameState();
    this.setState({
      currentGameObject: null
    });
  };

  stopListeningChatInput() {
    const stopListeningMsg = {
      type: "stopListening"
    };
    this.ws.send(JSON.stringify(stopListeningMsg));
    if (this.timer) {
      clearInterval(this.timer);
    }
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

  onShowResultsClick = () => {
    this.setState({
      showResults: true,
      isGamePlaying: false
    });
    this.resetChatStorage();
  };

  render() {
    return (
      <div className="madlibs__main">
        <Navigation />
        <ThreeJsBg
          cssClass="madlibs__three-canvas"
          animType="madlibs"
          msg={this.state.latestMsg}
        />
        <div className="madlibs__right-panel">
          {this.state.showStreamBox ? (
            <div className="madlibs__streambox">
              <StreamConnectionBox
                onStreamChange={this.onStreamChange}
                onSubmitStreamClick={this.onSubmitStreamClick}
                onTimerChange={this.onTimerChange}
                chatTimer={this.state.chatTimer}
                streamUrl={this.state.streamUrl}
                onStreamConnectionResetClick={this.onStreamConnectionResetClick}
              />
            </div>
          ) : (
            <div className="madlibs__stream-tag" onClick={this.toggleShowStreamConnectionBox}>
              <span className="madlibs__stream-name">{this.state.streamUrl}</span>
            </div>
          )}
          <DisplayMsgs latestMsg={this.state.latestMsg} rankedMsgs={this.state.rankedMsgs} />
        </div>
        <div className="madlibs__left-panel">
          <h1 className="madlibs__title">Madlibs</h1>
          {!this.state.currentGameObject ? (
            <GameLibraryDisplay
              className="madlibs__gameLibraryDisplay"
              gameObjectLibrary={this.state.gameObjectLibrary}
              onGameTitleClick={this.onGameTitleClick}
              showStreamBox={this.state.showStreamBox}
            />
          ) : (
            <GameDisplay
              chatAnswer={this.state.rankedMsgs[0]}
              answerArray={this.state.answerArray}
              blankIndex={this.state.blankIndex}
              isGamePlaying={this.state.isGamePlaying}
              chatTimer={this.state.chatTimer}
              timeLeft={this.state.timeLeft}
              showResults={this.state.showResults}
              currentGameObject={this.state.currentGameObject}
              onNextClick={this.onNextClick}
              onRestartGameClick={this.onRestartGameClick}
              onGameBeginClick={this.onGameBeginClick}
              onReturnLibClick={this.onReturnLibClick}
              onShowResultsClick={this.onShowResultsClick}
            />
          )}
        </div>
      </div>
    );
  }
}

export default MadlibsHome;
