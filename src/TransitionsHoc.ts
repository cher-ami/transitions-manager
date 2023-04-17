import { useIsMount } from "./transitionsManagerHooks";
import { TransitionsManager } from "./TransitionsManager";
import React from "react";

/**
 * Transitions Hoc
 *
 * Mount and Unmount component after playIn & playOut if needed
 * @param Component
 * @param manager
 * @constructor
 */
export const TransitionsHoc =
  (Component: React.FunctionComponent, manager: TransitionsManager) =>
  (props): JSX.Element => {
    if (!manager || !(manager instanceof TransitionsManager)) {
      console.error("transitionsManager instance is not found, return.");
      return;
    }
    const C = React.createElement(Component, props);

    if (!manager.autoMountUnmount) return C;

    return useIsMount(manager as TransitionsManager) ? C : null;
  };
