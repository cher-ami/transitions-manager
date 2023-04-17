import { useStack } from "@cher-ami/router";
import React, { ForwardedRef, forwardRef, useRef } from "react";
import { ButtonTransitionsManager } from "../components/ButtonTransitionsManager";
import Button from "../components/Button";

const componentName = "Home";
const Home = forwardRef((props, handleRef: ForwardedRef<any>) => {
  const rootRef = useRef(null);

  useStack({
    componentName,
    handleRef,
    rootRef,
  });

  const clickPlayIn = async () => {
    ButtonTransitionsManager.playIn({ duration: 2 });
  };

  const clickPlayOut = async () => {
    await ButtonTransitionsManager.playOut({ duration: 1 });
    console.log("end !");
  };

  return (
    <div className={componentName} ref={rootRef}>
      {componentName}
      <br />
      <button onClick={clickPlayIn}>play-in</button>
      <button onClick={clickPlayOut}>play-out</button>
      <Button />
    </div>
  );
});

Home.displayName = componentName;
export default Home;
