import React from "react";

function DisplayMsgs({ msgs }) {
  let msgsArray = msgs.map((msg, index) => {
    return <h3 key={index}>{msg}</h3>;
  });
  return <div>{msgsArray}</div>;
}

export default DisplayMsgs;
