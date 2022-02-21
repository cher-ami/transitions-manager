import React from "react"
import { useIsMount } from "../src/transitionsManagerHooks"
import TestComponent from "./TestComponent"

const App = () => {
  const mountTestComponent = useIsMount(TestComponent.transitionsManager)

  return (
    <div className="App">
      <button onClick={() => TestComponent.transitionsManager.playIn()}>play-in</button>
      <button onClick={() => TestComponent.transitionsManager.playOut()}>play-out</button>
      {mountTestComponent && <TestComponent />}
    </div>
  )
}

export default App
