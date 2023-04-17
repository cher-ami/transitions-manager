import { useStack } from "@cher-ami/router";
import { ForwardedRef, forwardRef, useRef } from "react";

const componentName = "Second";
const Second = forwardRef((props, handleRef: ForwardedRef<any>) => {
  const rootRef = useRef(null);

  useStack({
    componentName,
    handleRef,
    rootRef,
  });

  return (
    <div className={componentName} ref={rootRef}>
      {componentName}
    </div>
  );
});

Second.displayName = componentName;
export default Second;
