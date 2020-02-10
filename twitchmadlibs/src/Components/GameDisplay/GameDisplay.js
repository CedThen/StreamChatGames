import React from "react";
import "./GameDisplay.scss";

const GameDisplay = ({
  chatAnswer,
  answerArray,
  currentGameObject,
  blankIndex,
  timeLeft,
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

  const TimerDisplay = () => {
    return <div>{timeLeft} s</div>;
  };
  const BlankDisplay = () => {
    return (
      <div>
        {timeLeft === 0 ? chatAnswer : <div></div>} {blanksArray[blankIndex]}
      </div>
    );
  };
  const NextClick = () => {
    if (timeLeft === 0 && answerArray.length < blanksArray.length) {
      return <div onClick={onNextClick}>Next</div>;
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
        Reached end of game!!!
        <span onClick={onShowResultsClick}>Show Results</span>
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
      <h2>{currentGameObject.title}</h2>
      {!isGamePlaying && answerArray.length === 0 ? (
        <h2 className="gameDisplay__begin-btn" onClick={onGameBeginClick}>
          Begin!
        </h2>
      ) : (
        <div></div>
      )}
      {isGamePlaying ? <GameContainer /> : <div></div>}
      {showResults ? <DisplayResults /> : <div></div>}
      <br></br>
      <h3 onClick={onReturnLibClick}>Return to Game Selection</h3>
      <h3 onClick={onRestartGameClick}>Restart</h3>
    </div>
  );
};

export default GameDisplay;
