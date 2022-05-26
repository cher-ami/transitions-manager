import React from "react"
import { useIsMount } from "../src"
import TestHeader, { testHeaderTransitionsManager } from "./TestHeader"
import TestFooter from "./TestFooter"

const App = () => {
  const mountTestFooter = useIsMount(TestFooter.transitionsManager)

  const clickPlayIn = async () => {
    testHeaderTransitionsManager.playIn()
  }

  const clickPlayOut = async () => {
    await testHeaderTransitionsManager.playOut()
    console.log("end !")
  }

  return (
    <div className="App">
      <button onClick={clickPlayIn}>play-in</button>
      <button onClick={clickPlayOut}>play-out</button>
      <TestHeader className={"hello"} />
    </div>
  )
}

export default App
