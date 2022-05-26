import {useIsMount} from "./transitionsManagerHooks"
import {TransitionsManager} from "./TransitionsManager"
import React from "react"

export const TransitionsManagerHoc = (Component, manager?: TransitionsManager) => (props?) => {

  const C = <Component {...props} />;

  if (!manager.autoMountUnmount) return C;

  // case autoMountUnmount
  const isMount = useIsMount(manager)

  return isMount ? C : null
}
