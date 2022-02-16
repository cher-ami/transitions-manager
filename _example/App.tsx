import React from "react"
import { useIsMount } from "../src/transitionsManagerHooks"
import TestComponent from "./TestComponent"

const App = () => {

  const mountTestComponent = useIsMount(TestComponent.transitionsManager)

  return (
    <div>
      <button onClick={() => TestComponent.transitionsManager.playIn()}> PLAY_IN component </button>
      <button onClick={() => TestComponent.transitionsManager.playOut()}> PLAY_OUT component </button>

      {mountTestComponent && <TestComponent />}
    </div>
  )
}

export default App
