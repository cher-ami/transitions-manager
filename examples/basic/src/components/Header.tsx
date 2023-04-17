import React, { useLayoutEffect, useRef} from "react"
import {TransitionsManager, usePlayIn, usePlayOut,TransitionsHoc} from "@cher-ami/transitions-manager"
import { gsap } from "gsap"

const name = "TestHeader"
import debug from "@wbe/debug"
const log = debug(`front:${name}`)

/**
 *
 */
export const headerTransitionsManager = new TransitionsManager<{duration?: number}>()

/**
 *
 * @param props
 * @constructor
 */
function Header(props: {className?: string}):JSX.Element {
  const $root = useRef(null)

  // --------------------------––--------------------------–– INIT TIMELINE

  const tl = useRef<gsap.core.Timeline>()

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

  usePlayIn(headerTransitionsManager, async (done, options) => {
    log('playin options',options)
    await tl.current?.play()
    done()
  })
  usePlayOut(headerTransitionsManager, async (done, options) => {
    log('playout options',options)
    await tl.current?.reverse()
    done()
  })

  // --------------------------––--------------------------–– RENDER

  return (
    <header className={props.className} ref={$root}>
        Header
    </header>
  )
}

export default TransitionsHoc(Header, headerTransitionsManager)
