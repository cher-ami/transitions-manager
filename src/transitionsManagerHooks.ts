import {useLayoutEffect, useState} from "react"
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
  callback: (playState: TPlayState, options: Record<any, any>) => void,
  deps: any[] = []
): { playState: TPlayState, options: Record<any, any>  } => {
  const [playState, setPlayState] = useState<TPlayState>(manager.playStateSignal.state)
  const [options, setOptions] = useState<Record<any, any>>(manager.playStateSignal.options)

  useLayoutEffect(() => {
    const handler = (p: TPlayState, o: Record<any, any>): void => {
      setPlayState(p)
      setOptions(o)
      callback(p, o)
    }
    return manager.playStateSignal.on(handler)
  }, deps)

  return {playState, options}
}

/**
 * usePlayIn
 * Execute callback when playState is "play-in" state
 */
export const usePlayIn = (
  manager: TransitionsManager,
  callback: (done: () => void, options) => void,
  deps: any[] = []
): void => {
  useLayoutEffect(() => {
    const handler = (p: TPlayState, options): void => {
      if (p !== "play-in") return
      callback(manager.playInComplete, options)
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
  callback: (done: () => void, options) => void,
  deps: any[] = []
): void => {
  useLayoutEffect(() => {
    const handler = (p: TPlayState, options): void => {
      if (p !== "play-out") return
      callback(manager.playOutComplete, options)
    }
    return manager.playStateSignal.on(handler)
  }, deps)
}
