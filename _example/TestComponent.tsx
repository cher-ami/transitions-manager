import React, { useLayoutEffect, useRef } from "react"
import { TransitionsManager, TPlayState } from "../src/TransitionsManager"
import { gsap } from "gsap"
const name = "TestComponent"

import debug from "@wbe/debug"
import {
  usePlayIn,
  usePlayOut,
  useTransitionsManager,
} from "../src/transitionsManagerHooks"
const log = debug(`front:${name}`)

function TestComponent() {
  const $root = useRef(null)

  // --------------------------––--------------------------–– INIT TIMELINE

  const tl = useRef<gsap.core.Timeline>()

  // prettier-ignore
  const initTl = (): gsap.core.Timeline =>
    gsap.timeline({ paused: true }).fromTo(
      $root.current,
      { autoAlpha: 0,  y: 20 },
      { autoAlpha: 1, y: 0 }
    )

  useLayoutEffect(() => {
    if (!tl.current) tl.current = initTl()
  }, [])

  // --------------------------––--------------------------–– VIEW MANAGER

  /**
   * Solution 1
   */

  usePlayIn(TestComponent.transitionsManager, async (done) => {
    await tl.current.play()
    done()
  })

  usePlayOut(TestComponent.transitionsManager, async (done) => {
    await tl.current.reverse()
    done()
  })

  /**
   * Solution 2
   */

  /*
    useTransitionsManager(TestComponent.transitionsManager, async (playState) => {
      log("play", playState)
      if (playState === "play-in") {
        await tl.current.play()
        TestComponent.transitionsManager.playInComplete()
      }
      if (playState === "play-out") {
        await tl.current.reverse()
        TestComponent.transitionsManager.playOutComplete()
      }
    })

  */

  // --------------------------––--------------------------–– RENDER

  return (
    <div ref={$root} style={{ fontSize: "30px" }}>
      {name}
    </div>
  )
}

/**
 * Add a transitionsManager instance as static on the component
 */
TestComponent.transitionsManager = new TransitionsManager({
  autoMountUnmount: true,
  name: name,
  debug: true,
})

export default TestComponent
