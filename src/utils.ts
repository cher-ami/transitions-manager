/**
 * Exectute staggered transitions
 * 
 * @param delay (second)
 * @param anims Array of transition functions
 */

// prettier-ignore
export function stagger(
  delay = 1,
  anims: ()=> any[]
): [promise: () => Promise<any>, cancel: () => void] {
  
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
    timeouts?.forEach((el) => clearTimeout(el))
  }

  return [start, clear]
}
