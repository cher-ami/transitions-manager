import {useIsMount} from "./transitionsManagerHooks"
import {TransitionsManager} from "./TransitionsManager"
import React, {FunctionComponent} from "react"

export const TransitionsManagerHoc =
  (Component: FunctionComponent, manager: TransitionsManager) => (props): JSX.Element =>
{
  if (!manager) {
    console.error("transitionsManager instance is not found, return.")
    return
  }
  const C = React.createElement(Component, props);

  if (!manager.autoMountUnmount) return C;

  return useIsMount(manager) ? C : null
}

