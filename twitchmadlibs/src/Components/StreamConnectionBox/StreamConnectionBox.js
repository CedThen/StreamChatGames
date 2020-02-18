import React from "react";
import "./StreamConnectionBox.scss";

const StreamConnectionBox = ({
  onStreamChange,
  onSubmitStreamClick,
  onTimerChange,
  streamUrl,
  chatTimer,
  onStreamConnectionResetClick
}) => {
  return (
    <div className="streambox">
      <h3 className="streambox__title">Enter stream link</h3>
      <span className="streambox__url-tag">Twitch.tv/ </span>
      <input
        className="streambox__url-input"
        type="text"
        onChange={onStreamChange}
        value={streamUrl}
      />
      <div className="streambox__timer-tag">Chat Input Timer (seconds):</div>
      <input
        className="streambox__timer-input-range"
        type="range"
        min="15"
        max="120"
        defaultValue="30"
        onChange={onTimerChange}
      />
      <span className="streambox__timer-seconds">{chatTimer} seconds</span>
      <br />
      <input
        className="streambox__url-submit"
        type="submit"
        value="Submit!"
        onClick={onSubmitStreamClick}
      />
      {streamUrl !== "" ? (
        <div onClick={onStreamConnectionResetClick}>Reset</div>
      ) : (
        <div></div>
      )}
    </div>
  );
};

export default StreamConnectionBox;
