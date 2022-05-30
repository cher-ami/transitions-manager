import React from "react"
import Header, {HeaderTransitionsManager} from "./Header"

const App = () => {
  const clickPlayIn = async () => {
    HeaderTransitionsManager.playIn({duration: 0.5})
  }

  const clickPlayOut = async () => {
    await HeaderTransitionsManager.playOut({duration: 1.5})
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
