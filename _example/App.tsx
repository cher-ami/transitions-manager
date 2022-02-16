import React from "react"
import { useIsMount } from "../src/viewManagerHooks"
import TestComponent from "./TestComponent"

const App = () => {

  const mountTestComponent = useIsMount(TestComponent.viewManager)

  return (
    <div>
      <button onClick={() => TestComponent.viewManager.playIn()}> PLAY_IN component </button>
      <button onClick={() => TestComponent.viewManager.playOut()}> PLAY_OUT component </button>

      {mountTestComponent && <TestComponent />}
    </div>
  )
}

export default App
