import { resolve } from "path"
import React, { useCallback, useEffect } from "react"
import { useIsMount } from "../src/transitionsManagerHooks"
import TestComponent from "./TestComponent"
import TestFooter from "./TestFooter"


/**
 * Stagger function
 * @param anims 
 * @param delay second
 * @returns 
 */
function stagger (anims: any[], delay = 1): [promise:()=> Promise<any>, cancel: () => void]
{
  const timeouts = []
  
  const start = () => 
    new Promise((resolve: any) => { 
    for (let i = 0; i < anims.length; i++) 
    {

      const d = i * 1000 * delay;
      if (i < anims.length - 1)
      {
        const timeout = setTimeout(() => anims[i](), d)
        timeouts.push(timeout)
      }
      else
      {
        const timeout = setTimeout(async () => {
          await anims[i]()
          resolve()
        }, d)
        timeouts.push(timeout)
      }
     
    }
  })

  const clear = () => {
    timeouts?.forEach(el => clearTimeout(el))
  }

  return [
    start,
    clear
  ]

}



const App = () => {
  const mountTestComponent = useIsMount(TestComponent.transitionsManager)
  const mountTestFooter = useIsMount(TestFooter.transitionsManager)

  const clickPlayIn = async() => {
    const [start, cancel] = stagger([
      TestComponent.transitionsManager.playIn,
      TestFooter.transitionsManager.playIn,
    ], 0.1)

    start()
    setTimeout(()=> 
    {
      cancel()
    }, 90)
    
  }

  const clickPlayOut = async() => {
    const [playOut, cancel] = stagger([
      TestComponent.transitionsManager.playOut,
      TestFooter.transitionsManager.playOut,
    ].reverse(), 0.1)

    await playOut();
    console.log('end !')
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
