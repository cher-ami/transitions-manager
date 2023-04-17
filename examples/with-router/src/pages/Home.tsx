import { useStack } from "@cher-ami/router";
import React, { ForwardedRef, forwardRef, useRef, useState } from "react";
import { ButtonTransitionsManager } from "../components/ButtonTransitionsManager";
import Button from "../components/Button";
import { gsap } from "gsap";

const componentName = "Home";
const Home = forwardRef((props, handleRef: ForwardedRef<any>) => {
  const rootRef = useRef(null);

  useStack({
    componentName,
    handleRef,
    rootRef,
    playIn: () =>
      gsap.fromTo(rootRef.current, { autoAlpha: 0 }, { autoAlpha: 1 }) as any,
    playOut: () =>
      gsap.fromTo(rootRef.current, { autoAlpha: 1 }, { autoAlpha: 0 }) as any,
  });

  const clickPlayIn = async () => {
    ButtonTransitionsManager.playIn({ duration: 2 });
  };

  const clickPlayOut = async () => {
    await ButtonTransitionsManager.playOut({ duration: 1 });
  };

  const [count, setCount] = useState(0);

  return (
    <div className={componentName} ref={rootRef}>
      {componentName}
      <br />
      <button onClick={clickPlayIn}>play-in Button</button>
      <button onClick={clickPlayOut}>play-out Button</button>
      <button onClick={() => setCount(count + 1)}>rerender Button</button>
      <br />
      <Button key={count} />
    </div>
  );
});

Home.displayName = componentName;
export default Home;
