import {useIsMount} from "./transitionsManagerHooks"
import {TransitionsManager} from "./TransitionsManager"
import React from "react"

export const mountHoc = (Component, manager?: TransitionsManager) => (props?) => {
  const isMount = useIsMount(manager)
  return isMount ? <Component {...props} /> : null
}
