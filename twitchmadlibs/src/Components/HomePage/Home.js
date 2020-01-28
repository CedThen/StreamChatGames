import React from "react";
import "./Home.scss";
import HomeBody from "./HomeBody";

class Home extends React.Component {
  render() {
    return (
      <div>
        <div>
          <header className="header">
            <div className="header__text-box">
              <h1 className="header__heading-primary">Streamer Chat Games</h1>
              <h3 className="header__heading-sub">Pick your poison</h3>
            </div>
          </header>
        </div>
        <HomeBody />
      </div>
    );
  }
}

export default Home;
