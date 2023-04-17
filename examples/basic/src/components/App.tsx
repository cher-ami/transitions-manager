import React from "react"
import Header, {headerTransitionsManager} from "./Header"

const App = () => {
  const clickPlayIn = async () => {
    headerTransitionsManager.playIn({duration: 2})
  }

  const clickPlayOut = async () => {
    await headerTransitionsManager.playOut({duration: 1})
    console.log("end !")
  }

  return (
    <div className="App">
      <button onClick={clickPlayIn}>play-in</button>
      <button onClick={clickPlayOut}>play-out</button>
      <Header />
    </div>
  )
}

export default App
