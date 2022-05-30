import React from "react"
import Header, {HeaderTransitionsManager} from "./Header"

const App = () => {
  const clickPlayIn = async () => {
    HeaderTransitionsManager.playIn()
  }

  const clickPlayOut = async () => {
    await HeaderTransitionsManager.playOut()
    console.log("end !")
  }

  return (
    <div className="App">
      <button onClick={clickPlayIn}>play-in</button>
      <button onClick={clickPlayOut}>play-out</button>
      <Header className={"hello"} />
    </div>
  )
}

export default App
