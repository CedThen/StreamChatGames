import React from "react";
import "./GameDisplay.scss";

const GameDisplay = ({
  chatTimer,
  currentGameObject,
  onGameBeginClick,
  onRestartGameClick,
  onReturnLibClick
}) => {
  // const display = currentGameObject.game.value;
  return (
    <div className="gameDisplay gameDisplay__container">
      <h1 className="gameDisplay__begin-btn" onClick={onGameBeginClick}>
        Begin!
      </h1>
      <br></br>
      <h2>{currentGameObject.title}</h2>
      <br></br>
      <h3 onClick={onReturnLibClick}>Return to Game Selection</h3>
      <h3 onClick={onRestartGameClick}>Restart</h3>
    </div>
  );
};

export default GameDisplay;
