import React from "react";
import Home from "./Components/HomePage/Home";
import MadlibsHome from "./Components/Madlibs/MadlibsMain";
// import Navigation from "./Components/Navbar/Navigation";
import About from "./Components/About/About";
import { BrowserRouter, Route, Switch } from "react-router-dom";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Switch>
            <Route path="/" component={Home} exact />
            <Route path="/Madlibs" component={MadlibsHome} />
            <Route path="/About" component={About} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
