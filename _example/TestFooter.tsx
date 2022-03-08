import React, { useLayoutEffect, useRef } from "react"
import { TransitionsManager } from "../src/TransitionsManager"
import { gsap } from "gsap"
const name = "TestFooter"

import debug from "@wbe/debug"
import { usePlayIn, usePlayOut } from "../src/transitionsManagerHooks"
const log = debug(`front:${name}`)

function TestFooter() {
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

  usePlayIn(TestFooter.transitionsManager, async (done) => {
    await tl.current.play()
    done()
  })

  usePlayOut(TestFooter.transitionsManager, async (done) => {
    await tl.current.reverse()
    done()
  })

  // --------------------------––--------------------------–– RENDER

  return (
    <div ref={$root} className={name}>
      Footer
    </div>
  )
}

/**
 * Add a transitionsManager instance as static on the component
 */

TestFooter.transitionsManager = new TransitionsManager({
  autoMountUnmount: true,
  name: name,
})

export default TestFooter
