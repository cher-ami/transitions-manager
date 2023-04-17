import React from "react";
import { Link, Stack } from "@cher-ami/router";
import { ButtonTransitionsManager } from "./ButtonTransitionsManager";

const App = () => {
  const transitions = ({ previousPage, currentPage }): Promise<any> =>
    new Promise(async (resolve) => {
      currentPage.$element.style.visibility = "hidden"
      if (previousPage) await previousPage?.playOut();
      ButtonTransitionsManager.mountStateSignal.dispatch("unmount");
      if (currentPage) currentPage?.playIn();

      resolve();
    });

  return (
    <div className="App">
      <Link to={"/"} children={"home"} />
      <Link to={"/second"} children={"second"} />
      <Stack className={"Stack"} manageTransitions={transitions} />
    </div>
  );
};

export default App;
