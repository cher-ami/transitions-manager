import { resolve } from "path"
import React from "react"
import { stagger } from "../src"
import { useIsMount } from "../src/transitionsManagerHooks"
import TestComponent from "./TestHeader"
import TestFooter from "./TestFooter"

const App = () => {
  const mountTestComponent = useIsMount(TestComponent.transitionsManager)
  const mountTestFooter = useIsMount(TestFooter.transitionsManager)

  const clickPlayIn = async () => {

    const [start, clear] = stagger(0.1,
    [
      TestComponent.transitionsManager.playIn,
      TestFooter.transitionsManager.playIn,
    ])

    await start()
    console.log('play in end')
    
  }

  const clickPlayOut = async () => {
    const [playOut, clear] = stagger(
      0.1,
      [
        TestComponent.transitionsManager.playOut,
        TestFooter.transitionsManager.playOut,
      ].reverse()
    )

    await playOut()
    console.log("end !")
  }

  return (
    <div className="App">
      <button onClick={clickPlayIn}>play-in</button>
      <button onClick={clickPlayOut}>play-out</button>
      {mountTestComponent && <TestComponent />}
      {mountTestFooter && <TestFooter />}
    </div>
  )
}

export default App
