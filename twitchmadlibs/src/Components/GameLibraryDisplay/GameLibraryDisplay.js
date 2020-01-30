import React from "react";
import "./GameLibraryDisplay.scss";

const GameLibraryDisplay = ({ gameObjectLibrary, onGameTitleClick }) => {
  const gameObjectTitles = gameObjectLibrary.map((gameObject, index) => {
    return (
      <li
        key={index}
        className="gameObject__list-title"
        onClick={() => onGameTitleClick(index)}
      >
        {gameObject.title}
      </li>
    );
  });
  let randomSeed = Math.floor(Math.random() * gameObjectLibrary.length);
  return (
    <div className="GameLibraryDisplay__container">
      <h2 className="GameLibraryDisplay__title">
        Choose a madlib, or click random!
      </h2>
      <ul className="GameLibraryDisplay__list">{gameObjectTitles}</ul>
      <h2 onClick={() => onGameTitleClick(randomSeed)}>Random!</h2>
    </div>
  );
};

export default GameLibraryDisplay;
