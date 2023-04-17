import React from "react";
import { Link, Stack } from "@cher-ami/router";

const App = () => {
  return (
    <div className="App">
      <Link to={"/"} children={"home"} />
      <Link to={"/second"} children={"second"} />
      <Stack className={"Stack"} />
    </div>
  );
};

export default App;
