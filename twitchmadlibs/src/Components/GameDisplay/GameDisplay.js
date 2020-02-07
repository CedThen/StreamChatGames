import React from "react";
import "./GameDisplay.scss";

const GameDisplay = ({
  answerArray,
  currentGameObject,
  blankIndex,
  onGameBeginClick,
  onNextClick,
  onRestartGameClick,
  onReturnLibClick,
  timeLeft,
  gameEnd,
  showResults,
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

  const TimerDisplay = () => {
    if (timeLeft !== null && !gameEnd) {
      return <div>{timeLeft}</div>;
    } else {
      return <div></div>;
    }
  };
  const BeginAndBlankDisplay = () => {
    if (blankIndex !== null) {
      return <div>{blanksArray[blankIndex]}</div>;
    } else {
      return (
        <h2 className="gameDisplay__begin-btn" onClick={onGameBeginClick}>
          Begin!
        </h2>
      );
    }
  };
  const NextClick = () => {
    if (timeLeft === 0 && blankIndex !== null && !gameEnd) {
      return <div onClick={onNextClick}>Next</div>;
    } else {
      return <div></div>;
    }
  };
  const GameEndDisplay = () => {
    if (gameEnd) {
      return <div>Reached end of game!!! Show Results</div>;
    } else {
      return <div></div>;
    }
  };
  const DisplayResults = () => {
    return <div>Here be results lol</div>;
  };
  return (
    <div className="gameDisplay gameDisplay__container">
      <h2>{currentGameObject.title}</h2>
      {!showResults ? (
        <div>
          <TimerDisplay />
          <BeginAndBlankDisplay />
          <NextClick />
          <GameEndDisplay />{" "}
        </div>
      ) : (
        <DisplayResults />
      )}
      <br></br>
      <h3 onClick={onReturnLibClick}>Return to Game Selection</h3>
      <h3 onClick={onRestartGameClick}>Restart</h3>
    </div>
  );
};

export default GameDisplay;
