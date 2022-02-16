import React, { useLayoutEffect, useRef } from "react"
import { ViewManager, TPlayState } from "../src/ViewManager"
import { gsap } from "gsap"
const name = "TestComponent"

import debug from "@wbe/debug"
import { usePlayIn, usePlayOut, useViewManager } from "../src/viewManagerHooks"
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

  usePlayIn(TestComponent.viewManager, async (done) => {
    await tl.current.play()
    done()
  })

  usePlayOut(TestComponent.viewManager, async (done) => {
    await tl.current.reverse()
    done()
  })

  /**
   * Solution 2
   */

  /*
    useViewManager(TestComponent.viewManager, async (playState) => {
      log("play", playState)
      if (playState === "play-in") {
        await tl.current.play()
        TestComponent.viewManager.playInComplete()
      }
      if (playState === "play-out") {
        await tl.current.reverse()
        TestComponent.viewManager.playOutComplete()
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
 * Add a viewManager instance as static on the component
 */
TestComponent.viewManager = new ViewManager({
  autoMountUnmount: true,
  logName: name,
  showLog: true,
})

export default TestComponent
