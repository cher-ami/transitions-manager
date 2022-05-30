import { useLayoutEffect, useState } from "react"
import { TransitionsManager, TMountState, TPlayState } from "./TransitionsManager"

/**
 * useIsMount
 * @param manager
 * @param deps
 */
export const useIsMount = (manager: TransitionsManager, deps: any[] = []): boolean => {
  const [mount, setMount] = useState<boolean>(false)

  useLayoutEffect(() => {
    const handler = (event: TMountState): void => {
      if (event === "mount") {
        setMount(true)
        manager.mountComplete()
      }
      if (event === "unmount") {
        setMount(false)
        manager.unmountComplete()
      }
    }
    return manager.mountStateSignal.on(handler)
  }, deps)

  return mount
}

/**
 * useTransitionsManager
 *
 * @param manager
 * @param callback
 * @param deps
 * @returns
 */
export const useTransitionsManager = (
  manager: TransitionsManager,
  callback: (args: {[key:string]: any}) => void,
  deps: any[] = []
) => {
  const [args, setArgs] = useState<{playState:TPlayState}>(manager.playStateSignal.state)

  useLayoutEffect(() => {
    const handler = (args): void => {
      setArgs(args)
      callback(args)
    }
    return manager.playStateSignal.on(handler)
  }, deps)

  return args
}

/**
 * usePlayIn
 * Execute callback when playState is "play-in" state
 */
export const usePlayIn = (
  manager: TransitionsManager,
  callback: (args: {[key:string]: any}, done: () => void) => void,
  deps: any[] = []
): void => {
  useLayoutEffect(() => {
    const handler = (args): void => {
      if (args.playState !== "play-in") return
      callback(args, manager.playInComplete)
    }
    return manager.playStateSignal.on(handler)
  }, deps)
}

/**
 * usePlayOut
 * Execute callback when playState is "play-out" state
 */
export const usePlayOut = (
  manager: TransitionsManager,
  callback: (args: {[key:string]: any}, done: () => void) => void,
  deps: any[] = []
): void => {
  useLayoutEffect(() => {
    const handler = (args): void => {
      if (args.playState !== "play-out") return
      callback(args, manager.playOutComplete)
    }
    return manager.playStateSignal.on(handler)
  }, deps)
}
