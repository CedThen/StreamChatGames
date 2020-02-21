import React from "react";
import "./DisplayMsgs.scss";

function DisplayMsgs({ rankedMsgs }) {
  let msgsArray = rankedMsgs.map((msgObject, index) => {
    return (
      <li className="displayMsgs__text" key={index}>
        <h3>
          {msgObject.msg}{" "}
          <span className="displayMsgs__vote-count">Votes: {msgObject.count}</span>
        </h3>
      </li>
    );
  });
  return (
    <div className="displayMsgs__container">
      <h2 className="displayMsgs__title">Chat Input Ranking</h2>
      <ol>{msgsArray}</ol>
    </div>
  );
}

export default DisplayMsgs;
