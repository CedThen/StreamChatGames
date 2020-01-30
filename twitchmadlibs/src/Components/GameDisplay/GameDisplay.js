import React from "react";

const GameDisplay = ({ currentGameObject }) => {
  const display = currentGameObject.game.value;
  return <div>{display}</div>;
};

export default GameDisplay;
