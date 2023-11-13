import React, { useEffect, useLayoutEffect, useRef } from "react";
import {
  usePlayIn,
  usePlayOut,
  TransitionsHoc,
  useTransitionsManager,
} from "@cher-ami/transitions-manager";
import { gsap } from "gsap";
import debug from "@cher-ami/debug";
import { ButtonTransitionsManager } from "./ButtonTransitionsManager";

const name = "Button";
const log = debug(`front:${name}`);

/**
 *
 * @param props
 * @constructor
 */
function Button(props: { className?: string }): JSX.Element {
  const $root = useRef(null);

  // --------------------------––--------------------------–– INIT TIMELINE

  const tl = useRef<gsap.core.Timeline>();

  const initTl = (): gsap.core.Timeline =>
    gsap
      .timeline({ paused: true })
      .fromTo($root.current, { autoAlpha: 0.3, y: 20 }, { autoAlpha: 1, y: 0 });

  useLayoutEffect(() => {
    if (!tl.current) tl.current = initTl();
  }, []);

  // --------------------------––--------------------------–– VIEW MANAGER
  //
  usePlayIn(ButtonTransitionsManager, async (done, options) => {
    log("playin options", options);
    await tl.current?.play();
    done();
  });
  usePlayOut(ButtonTransitionsManager, async (done, options) => {
    log("playout options", options);
    await tl.current?.reverse();
    done();
  });

  useTransitionsManager(ButtonTransitionsManager, async (state) => {
    log("state", state);

    if (state === "play-in") {
      await tl.current?.play();
    }

    if (state === "play-out") {
      await tl.current?.reverse();
    }
  });

  // --------------------------––--------------------------–– RENDER

  return (
    <header className={props.className} ref={$root}>
      Button
    </header>
  );
}

export default TransitionsHoc(Button, ButtonTransitionsManager);
