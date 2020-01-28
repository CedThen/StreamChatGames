import React from "react";
import "./HomeBody.scss";
import { NavLink } from "react-router-dom";

const HomeBody = () => {
  return (
    <div className="body__home">
      <div className="body__link-container">
        <div className="body__link-madlib">
          <NavLink className="body__nav-btn" to="/Madlibs">
            Madlibs
          </NavLink>
          <span className="body__text">
            How <span className="dumb">dumb</span> clever is your chat?
          </span>
        </div>
        <div>
          <NavLink className="body__nav-btn" to="/Madlibs">
            Crosswords
          </NavLink>
          <span className="body__text">How smart is your chat?</span>
        </div>
      </div>
    </div>
  );
};

export default HomeBody;
