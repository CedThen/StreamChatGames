import React from "react";
import "./GameLibraryDisplay.scss";

const GameDisplay = ({ gameObjectLibrary, onGameTitleClick }) => {
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
  return (
    <div className="GameLibraryDisplay__container">
      <h2 className="GameLibraryDisplay__title">
        Choose a madlib, or click random!
      </h2>
      <ul className="GameLibraryDisplay__list">{gameObjectTitles}</ul>
    </div>
  );
};

export default GameDisplay;
