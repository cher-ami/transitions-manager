import { resolve } from "path"
import React from "react"
import { stagger } from "../src"
import { useIsMount } from "../src"
import TestHeader, { TestHeaderTransitionsManager } from "./TestHeader"
import TestFooter from "./TestFooter"

const App = () => {
  const mountTestFooter = useIsMount(TestFooter.transitionsManager)

  const clickPlayIn = async () => {

    TestHeaderTransitionsManager.playIn()


  }

  const clickPlayOut = async () => {
    await TestHeaderTransitionsManager.playOut()
    console.log("end !")
  }

  return (
    <div className="App">
      <button onClick={clickPlayIn}>play-in</button>
      <button onClick={clickPlayOut}>play-out</button>
      <TestHeader className={"coucou"}/>
    </div>
  )
}

export default App
