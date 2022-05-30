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

  usePlayIn(HeaderTransitionsManager, async (args, done) => {
    await tl.current.play()
    log('args playIn', args)
    done()
  })

  usePlayOut(HeaderTransitionsManager, async (args, done) => {
    await tl.current.reverse()
    log('args playOut', args)
    done()
  })

  // --------------------------––--------------------------–– RENDER

  return (
    <header className={props.className} ref={$root}>
        Header
    </header>
  )
}

export const HeaderTransitionsManager = new TransitionsManager()

export default TransitionsHoc(Header, HeaderTransitionsManager)
