import React from "react";
import "./GameLibraryDisplay.scss";

const GameLibraryDisplay = ({ gameObjectLibrary, onGameTitleClick }) => {
  const gameObjectTitles = gameObjectLibrary.map((gameObject, index) => {
    return (
      <li key={index} onClick={() => onGameTitleClick(index)}>
        <span className="gameObject__list-title">{gameObject.title}</span>
      </li>
    );
  });
  let randomSeed = Math.floor(Math.random() * gameObjectLibrary.length);
  return (
    <div className="GameLibraryDisplay__container">
      <h2 className="GameLibraryDisplay__title">Choose a madlib</h2>
      <ul className="GameLibraryDisplay__list">{gameObjectTitles}</ul>
      <h2 className="GameLibraryDisplay__random" onClick={() => onGameTitleClick(randomSeed)}>
        Random!
      </h2>
    </div>
  );
};

export default GameLibraryDisplay;
