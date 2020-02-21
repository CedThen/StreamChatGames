import React from "react";
import "./GameDisplay.scss";

const GameDisplay = ({
  chatAnswer,
  answerArray,
  currentGameObject,
  blankIndex,
  timeLeft,
  chatTimer,
  isGamePlaying,
  showResults,
  onGameBeginClick,
  onNextClick,
  onRestartGameClick,
  onReturnLibClick,
  onShowResultsClick
}) => {
  const blanksArray = currentGameObject.game.blanks.map((blank, index) => {
    return (
      <div key={index}>
        ___________________
        <br></br>
        {blank}
      </div>
    );
  });

  // const timerStyle = {
  //   animation: "colorShift",
  //   animationDuration: chatTimer + "s"
  // };
  // console.log(timerStyle);
  // console.log("timeleft: ", timeLeft);
  const TimerDisplay = () => {
    return <div className="timerDisplay">{timeLeft} s</div>;
  };
  const BlankDisplay = () => {
    return (
      <div className="blank-display">
        {timeLeft === 0 ? chatAnswer.msg : <div></div>} {blanksArray[blankIndex]}
      </div>
    );
  };
  const NextClick = () => {
    if (timeLeft === 0 && answerArray.length < blanksArray.length) {
      return (
        <div className="next-btn" onClick={onNextClick}>
          Next
        </div>
      );
    } else if (timeLeft === 0 && answerArray.length === blanksArray.length) {
      return <GameEndDisplay />;
    } else {
      return <div></div>;
    }
  };
  const WordProgressCounter = () => {
    return (
      <div>
        {blankIndex + 1}/{blanksArray.length}
      </div>
    );
  };
  const GameEndDisplay = () => {
    return (
      <div>
        The End!
        <div className="game-end-display" onClick={onShowResultsClick}>
          Show Results
        </div>
      </div>
    );
  };
  const GameContainer = () => {
    return (
      <div>
        <TimerDisplay />
        <BlankDisplay />
        <WordProgressCounter />
        <NextClick />
      </div>
    );
  };
  const DisplayResults = () => {
    return (
      <div>
        Here be results lol
        {gameFinal}
      </div>
    );
  };
  let gameFinal = currentGameObject.game.value.map((value, index) => {
    return value.concat(`${answerArray[index]}`);
  });
  return (
    <div className="gameDisplay gameDisplay__container">
      <h2 className="gameDisplay__title">{currentGameObject.title}</h2>
      <br></br>
      {!isGamePlaying && answerArray.length === 0 ? (
        <h2 className="gameDisplay__begin-btn" onClick={onGameBeginClick}>
          Begin!
        </h2>
      ) : (
        <div></div>
      )}
      {isGamePlaying ? <GameContainer className="gameDisplay__game-container" /> : <div></div>}
      {showResults ? <DisplayResults /> : <div></div>}
      <br></br>
      <h3 className="gameDisplay__return-btn" onClick={onReturnLibClick}>
        Return to Game Selection
      </h3>
      <h3 className="gameDisplay__restart-btn" onClick={onRestartGameClick}>
        Restart
      </h3>
    </div>
  );
};

export default GameDisplay;
