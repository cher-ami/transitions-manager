import { useStack } from "@cher-ami/router";
import { ForwardedRef, forwardRef, useRef } from "react";
import { gsap } from "gsap";

const componentName = "Second";
const Second = forwardRef((props, handleRef: ForwardedRef<any>) => {
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

  return (
    <div className={componentName} ref={rootRef}>
      {componentName}
    </div>
  );
});

Second.displayName = componentName;
export default Second;
