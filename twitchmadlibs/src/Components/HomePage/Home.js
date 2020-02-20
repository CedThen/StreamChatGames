import React from "react";
import "./Home.scss";
import { NavLink } from "react-router-dom";
import Navigation from "../Navbar/Navigation.js";
import ThreeJsBg from "../ThreeJSBackground.js";

class Home extends React.Component {
  render() {
    return (
      <div className="header header__container">
        <Navigation />
        {/* <div className="header__three-canvas" ref={ref => (this.mount = ref)}></div> */}
        <ThreeJsBg cssClass="header__three-canvas" animType={"homePage"} />
        <header>
          <div className="header__text-box">
            <h1 className="header__heading-primary">Stream Chat Games</h1>
            {/* <h3 className="header__heading-sub">Pick your poison</h3> */}
          </div>
        </header>
        <div className="link-container">
          <div className="link-container__madlib">
            <NavLink className="link-container__btn" to="/Madlibs">
              Madlibs
            </NavLink>
            <div className="link-container__text">
              How <span className="dumb">dumb</span> clever is your chat?
            </div>
          </div>
          <div className="link-container__crosswords">
            <NavLink className="link-container__btn" to="/Madlibs">
              Crosswords
            </NavLink>
            <div className="link-container__text">How smart is your chat?</div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
