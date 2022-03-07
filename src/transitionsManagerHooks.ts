import { useEffect, useLayoutEffect, useState } from "react"
import { TransitionsManager, TMountState, TPlayState } from "./TransitionsManager"

/**
 * useIsMount
 * @param manager
 */
export const useIsMount = (manager: TransitionsManager, deps: any[] = []): boolean => {
  const [mount, setMount] = useState<boolean>(false)

  useEffect(() => {
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
  callback: (playState: TPlayState) => void,
  deps: any[] = []
): TPlayState => {
  const [playState, setPlayState] = useState<TPlayState>(manager.playStateSignal.state)

  useLayoutEffect(() => {
    const handler = (p: TPlayState): void => {
      setPlayState(p)
      callback(p)
    }
    return manager.playStateSignal.on(handler)
  }, deps)

  return playState
}

/**
 * usePlayIn
 * Execute callback when playState is "play-in" state
 */
export const usePlayIn = (
  manager: TransitionsManager,
  callback: (done: () => void) => any,
  deps: any[] = []
): void => {
  useLayoutEffect(() => {
    const handler = (p: TPlayState): void => {
      if (p !== "play-in") return
      callback(manager.playInComplete.bind(manager))
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
  callback: (done: () => void) => void,
  deps: any[] = []
): void => {
  useLayoutEffect(() => {
    const handler = (p: TPlayState): void => {
      if (p !== "play-out") return
      callback(manager.playOutComplete.bind(manager))
    }
    return manager.playStateSignal.on(handler)
  }, deps)
}
