import React, { useLayoutEffect, useRef} from "react"
import {TransitionsManager, usePlayIn, usePlayOut} from "../src"
import {TransitionsHoc} from "../src"
import { gsap } from "gsap"

const name = "TestHeader"
import debug from "@wbe/debug"
const log = debug(`front:${name}`)

function Header(props: {className?: string}):JSX.Element {
  const $root = useRef(null)

  // --------------------------––--------------------------–– INIT TIMELINE

  const tl = useRef<gsap.core.Timeline>()

  // prettier-ignore
  const initTl = (): gsap.core.Timeline =>
    gsap.timeline({ paused: true }).fromTo(
      $root.current,
      { autoAlpha: 0.3,  y: 20 },
      { autoAlpha: 1, y: 0 }
    )

  useLayoutEffect(() => {
    if (!tl.current) tl.current = initTl()
  }, [])

  // --------------------------––--------------------------–– VIEW MANAGER

  /**
   * Solution 1
   */

  usePlayIn(HeaderTransitionsManager, async (done, options) => {
    log('playin options',options)
    await tl.current.play()
    done()
  })

  usePlayOut(HeaderTransitionsManager, async (done, options) => {
    log('playout options',options)
    await tl.current.reverse()
    done()
  })

  // --------------------------––--------------------------–– RENDER

  return (
    <header className={props.className} ref={$root}>
        Header
    </header>
  )
}

export const HeaderTransitionsManager = new TransitionsManager<{duration: number}>()

export default TransitionsHoc(Header, HeaderTransitionsManager)
