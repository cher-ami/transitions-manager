import * as React from "react"
import {act, render} from "@testing-library/react"
import {TransitionsManager, usePlayIn, usePlayOut} from "../src"
import {TransitionsHoc} from "../src"

const {log} = console


// ----------------------------------------------------------------------------- PREPARE

const waiting = ((time: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, time)))

const mockUsePlayIn = jest.fn()
const mockUsePlayInComplete = jest.fn()
const mockUsePlayOut = jest.fn()
const mockUsePlayOutComplete = jest.fn()

let TestTransitionsManager = new TransitionsManager()
let App
let Header

beforeEach(() => {
  TestTransitionsManager = new TransitionsManager()
  mockUsePlayIn.mockClear()
  mockUsePlayInComplete.mockClear()
  mockUsePlayOut.mockClear()
  mockUsePlayOutComplete.mockClear()

  /**
   * App
   */
  App = ({transitionDuration = 0}) => {
    const clickPlayIn = async () => {
      TestTransitionsManager.playIn()
    }
    const clickPlayOut = async () => {
      TestTransitionsManager.playOut()
    }
    return (<div className="App">
      <button onClick={clickPlayIn} data-testid={"play-in"}>play-in</button>
      <button onClick={clickPlayOut} data-testid={"play-out"}>play-out</button>
      <div data-testid={"header-wrapper"}>
        <Header className={"header"} transitionDuration={transitionDuration}/>
      </div>
    </div>)
  }

  /**
   * Header
   */
  Header = TransitionsHoc((props: { className?: string, transitionDuration?: number }): JSX.Element => {
    usePlayIn(TestTransitionsManager, async (done) => {
      mockUsePlayIn()
      // transition simulation
      await waiting(props.transitionDuration)
      done()
      mockUsePlayInComplete()
    })
    usePlayOut(TestTransitionsManager, async (done) => {
      mockUsePlayOut()
      // transition simulation
      await waiting(props.transitionDuration)
      done()
      mockUsePlayOutComplete()
    })
    return <header className={props.className}
                   data-testid={"header"}>Header</header>
  }, TestTransitionsManager)

})

// ----------------------------------------------------------------------------- TEST

describe("Transitions Manager", () => {

  it("should respect mount and unmount properly", async () => {
    expect(TestTransitionsManager.mountStateSignal.state).toBe("unmount")
    TestTransitionsManager.mount()
    expect(TestTransitionsManager.mountStateSignal.state).toBe("mount")
    TestTransitionsManager.unmount()
    expect(TestTransitionsManager.mountStateSignal.state).toBe("unmount")
  })

  it("should mount automatically when playIn", async () => {
    expect(TestTransitionsManager.mountStateSignal.state).toBe("unmount")
    expect(TestTransitionsManager.playStateSignal.state).toBe("hidden")

      // start playIn
    await act(async () => {
      TestTransitionsManager.playIn()
      expect(TestTransitionsManager.mountStateSignal.state).toBe("mount")
    })
  })

  it("should respect state cycle using component", async () => {
    const transitionDuration = 200
    const wrapper = render(<App transitionDuration={transitionDuration}/>)
    const playInButton = wrapper.getByTestId("play-in")
    const playOutButton = wrapper.getByTestId("play-out")

    /**
     * Mount + playIn
     */
    // Header is wrapped in container, test if container has child element
    expect(wrapper.getByTestId("header-wrapper").firstChild).toBe(null)
    // At this step, state should be unmount
    expect(TestTransitionsManager.mountStateSignal.state).toBe("unmount")

      // then, chick play in button
    await act(async () => {
      playInButton.click()

    })

    // is mount
    expect(TestTransitionsManager.mountStateSignal.state).toBe("mount")
    expect(wrapper.getByTestId("header")).toBeDefined()

    // because hack render 10ms...
    await waiting(12)

    // now he change to play in state
    expect(TestTransitionsManager.playStateSignal.state).toBe("play-in")
    expect(mockUsePlayIn).toHaveBeenCalledTimes(1)

    // waiting for transitions end
    await waiting(transitionDuration)

    // after transition "done()" function update state to visible
    expect(TestTransitionsManager.playStateSignal.state).toBe("visible")
    expect(mockUsePlayInComplete).toHaveBeenCalledTimes(1)

    /**
     * playOut + unmount
     */
    await act(async () => {
      // then, chick play in button
      playOutButton.click()
      // playOut
      expect(TestTransitionsManager.playStateSignal.state).toBe("play-out")
      expect(mockUsePlayOut).toHaveBeenCalledTimes(1)
      await waiting(transitionDuration)
    })
    // waiting for transitions end
    expect(TestTransitionsManager.playStateSignal.state).toBe("hidden")
    expect(mockUsePlayOutComplete).toHaveBeenCalledTimes(1)
    // unmount, component is destroy
    expect(TestTransitionsManager.mountStateSignal.state).toBe("unmount")

    expect(wrapper.getByTestId("header-wrapper").firstChild).toBe(null)

  })

})
