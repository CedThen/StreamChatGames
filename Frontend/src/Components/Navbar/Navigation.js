import React from "react";
import { NavLink } from "react-router-dom";
import "./Navigation.scss";

class Navigation extends React.Component {
  render() {
    return (
      <div className="navigation">
        <NavLink className="nav-btn" to="/">
          Home
        </NavLink>
        <NavLink className="nav-btn" to="/Madlibs">
          Madlibs
        </NavLink>
        <NavLink className="nav-btn" to="/About">
          About
        </NavLink>
      </div>
    );
  }
}

export default Navigation;
