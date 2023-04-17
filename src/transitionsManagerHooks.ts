import {
  TransitionsManager,
  TMountState,
  TPlayState,
} from "./TransitionsManager";
import { useState } from "react";
import { useIsomorphicLayoutEffect } from "./helpers/useIsomorphicLayoutEffect";
import debug from "@wbe/debug";
const log = debug("tm:hooks");
/**
 * useIsMount
 * @param manager
 * @param deps
 */
export const useIsMount = (
  manager: TransitionsManager,
  deps: any[] = []
): boolean => {
  const [mount, setMount] = useState<boolean>(false);

  useIsomorphicLayoutEffect(() => {
    const handler = (event: TMountState): void => {
      if (event === "mount") {
        setMount(true);
        manager.mountComplete();
      }
      if (event === "unmount") {
        setMount(false);
        manager.unmountComplete();
      }
    };
    return manager.mountStateSignal.on(handler);
    // return () => {
    //   log("unmount");
    //   manager.mountStateSignal.off(handler);
    //   setMount(false);
    //   manager.mountStateSignal.dispatch("unmount");
    //   manager.unmountComplete();
    // };
  }, deps);

  return mount;
};

/**
 * useTransitionsManager
 *
 * @param manager
 * @param callback
 * @param deps
 * @returns
 */
export const useTransitionsManager = <GOptions = {}>(
  manager: TransitionsManager,
  callback: (playState: TPlayState, options: GOptions) => void,
  deps: any[] = []
): { playState: TPlayState; options: GOptions } => {
  const [playState, setPlayState] = useState<TPlayState>(
    manager.playStateSignal.state
  );
  const [options, setOptions] = useState<GOptions>(
    manager.playStateSignal.options
  );

  useIsomorphicLayoutEffect(() => {
    const handler = (p: TPlayState, o: GOptions): void => {
      setPlayState(p);
      setOptions(o);
      callback(p, o);
    };

    return manager.playStateSignal.on(handler);

  }, deps);

  return { playState, options };
};

/**
 * usePlayIn
 * Execute callback when playState is "play-in" state
 */
export const usePlayIn = <GOptions = {}>(
  manager: TransitionsManager<GOptions>,
  callback: (done: () => void, options: GOptions) => void,
  deps: any[] = []
): void => {
  useIsomorphicLayoutEffect(() => {
    const handler = (p: TPlayState, options: GOptions): void => {
      if (p !== "play-in") return;
      callback(manager.playInComplete, options);
    };
    return manager.playStateSignal.on(handler) as any;
  }, deps);
};

/**
 * usePlayOut
 * Execute callback when playState is "play-out" state
 */
export const usePlayOut = <GOptions = {}>(
  manager: TransitionsManager<GOptions>,
  callback: (done: () => void, options: GOptions) => void,
  deps: any[] = []
): void => {
  useIsomorphicLayoutEffect(() => {
    const handler = (p: TPlayState, options: GOptions): void => {
      if (p !== "play-out") return;
      callback(manager.playOutComplete, options);
    };
    return manager.playStateSignal.on(handler);
  }, deps);
};
