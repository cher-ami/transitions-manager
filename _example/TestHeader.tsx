import React, { useLayoutEffect, useRef } from "react"
import { TransitionsManager } from "../src"
import { usePlayIn, usePlayOut } from "../src"
import {mountHoc} from "../src/MountHoc"
import { gsap } from "gsap"

const name = "TestHeader"
import debug from "@wbe/debug"
const log = debug(`front:${name}`)

function TestHeader(props: {className?: string}) {
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

  usePlayIn(TestHeaderTransitionsManager, async (done) => {
    await tl.current.play()
    done()
  })

  usePlayOut(TestHeaderTransitionsManager, async (done) => {
    await tl.current.reverse()
    done()
  })
  /**
   * Solution 2
   */

  /*
    useTransitionsManager(TestHeaderTransitionsManager, async (playState) => {
      if (playState === "play-in") {
        await tl.current.play()
        TestHeader.transitionsManager.playInComplete()
      }
      if (playState === "play-out") {
        await tl.current.reverse()
        TestHeader.transitionsManager.playOutComplete()
      }
    })

  */

  // --------------------------––--------------------------–– RENDER

  return (
    <div ref={$root} className={props.className}>
      Header
    </div>
  )
}

/**
 * Add a transitionsManager instance
 */

export const TestHeaderTransitionsManager = new TransitionsManager({
  autoMountUnmount: true,
  name: name,
})

export default mountHoc(TestHeader, TestHeaderTransitionsManager)
