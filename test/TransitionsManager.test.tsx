import * as React from "react"
import {useLayoutEffect, useRef} from "react"
import {render} from "@testing-library/react"
import {TransitionsManager, usePlayIn, usePlayOut} from "../src"
import {TransitionsHoc} from "../src"
import {gsap} from "gsap"

const TestTransitionsManager = new TransitionsManager()

const App = () => {
  const clickPlayIn = async () => {
    TestTransitionsManager.playIn()
  }
  const clickPlayOut = async () => {
    await TestTransitionsManager.playOut()
    console.log("end !")
  }
  return (<div className="App">
    <button onClick={clickPlayIn}>play-in</button>
    <button onClick={clickPlayOut}>play-out</button>
    {/*<Header className={"hello"}/>*/}
  </div>)
}

const Header = TransitionsHoc((props: { className?: string }): JSX.Element => {
  const $root = useRef(null)
  const tl = useRef<gsap.core.Timeline>()
  const initTl = (): gsap.core.Timeline => gsap.timeline({paused: true}).fromTo($root.current, {
    autoAlpha: 0.3, y: 20
  }, {autoAlpha: 1, y: 0})

  useLayoutEffect(() => {
    if (!tl.current) tl.current = initTl()
  }, [])
  usePlayIn(TestTransitionsManager, async (done) => {
    await tl.current.play()
    done()
  })
  usePlayOut(TestTransitionsManager, async (done) => {
    await tl.current.reverse()
    done()
  })
  return <header className={props.className} ref={$root}>Header</header>
}, TestTransitionsManager)

// -----------------------------------------------------------------------------

describe("T M", () => {

  it("should render children element by default", () => {
    const {container} = render(<App/>)
    const app = container.firstChild
//    expect(app.textContent).toBe("app")
//    TODO test
  })

})
