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
      currentGameObject: null,
      currentlyDisplayedBlank: null,
      blankIndex: null,
      timeLeft: null,
      gameEnd: false,
      answerArray: [],
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
      console.log("disconnected");
    };
    //reset stream before page refresh/unload
    window.addEventListener("unload", () => {
      this.ws.send(JSON.stringify({ type: "streamReset" }));
    });
    //save timer as variable so it can be cleared later
    this.timer = null;
  }

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
      blankIndex: 0,
      timeLeft: this.state.chatTimer
    });
    //begin game loop
    this.gameLoop();
  };

  gameLoop = () => {
    //reset chat status, set timer
    this.resetChatStorage();
    this.setState({
      timeLeft: this.state.chatTimer
    });
    //start timer, logic for what happens when timer is at 0
    this.timer = setInterval(() => {
      if (this.state.timeLeft > 0) {
        //decrements timer
        this.setState({ timeLeft: this.state.timeLeft - 1 });
      } else {
        this.stopListeningChatInput();

        //new object to add to answerArray
        let newAnswerArray = [
          ...this.state.answerArray,
          this.state.rankedMsgs[0].msg
        ];

        //time is up, show next button, fill in blank with top word, save word into answer array
        this.setState({ timeLeft: 0, answerArray: newAnswerArray });
        console.log("answer Array: ", this.state.answerArray);

        //if able, increment blankIndex. depending on status of blank index, show either next or gameEnd
        if (
          this.state.blankIndex <
          this.state.currentGameObject.game.blanks.length
        ) {
          this.setState({
            //increments blankIndex
            blankIndex: this.state.blankIndex + 1
          });
        } else {
          this.setState({
            gameEnd: true,
            blankIndex: null,
            timeLeft: null
          });
        }

        clearInterval(this.timer);
      }
    }, 1000);
    //tells server to listen
    let beginListenMsg = {
      type: "beginListen"
    };
    this.ws.send(JSON.stringify(beginListenMsg));
  };

  onNextClick = () => {
    if (!this.state.gameEnd) {
      this.gameLoop();
    }
  };

  onRestartGameClick = () => {
    this.stopListeningChatInput();
    this.setState({ blankIndex: null, chatTimer: null, showResults: false });
    this.resetChatStorage();
  };

  onReturnLibClick = () => {
    this.resetChatStorage();
    this.stopListeningChatInput();
    this.setState({
      blankIndex: null,
      currentGameObject: null,
      showResults: false
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
    this.setState({ showResults: true });
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
            answerArray={this.state.answerArray}
            blankIndex={this.state.blankIndex}
            onNextClick={this.onNextClick}
            onRestartGameClick={this.onRestartGameClick}
            currentGameObject={this.state.currentGameObject}
            onGameBeginClick={this.onGameBeginClick}
            onReturnLibClick={this.onReturnLibClick}
            gameEnd={this.state.gameEnd}
            timeLeft={this.state.timeLeft}
            onShowResultsClick={this.onShowResultsClick}
            showResults={this.state.showResults}
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
