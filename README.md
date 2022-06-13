<h1 align="center" style="text-align:center">Transitions manager</h1>

<p align="center">
<img alt="npm" src="https://img.shields.io/npm/v/@cher-ami/transitions-manager">
<img alt="build" src="https://img.shields.io/bundlephobia/minzip/@cher-ami/transitions-manager">
<img alt="build" src="https://img.shields.io/npm/dt/@cher-ami/transitions-manager">
</p>
<p align="center">
Transitions manager allows to handle and dispatch transition states from anywhere in the application.
<br/>
<br/>
<img alt="demo" src="/screen.gif"/>
</p>

## Installation

```
npm i @cher-ami/transitions-manager
```

## Usage

### PlayIn and playOut

1. Create a new transitionsManager instance.
2. Wrap your component by `TransitionsHoc()`
3. Then, define transitions in `usePlayIn` and `usePlayOut` hooks.

```tsx
export const headerTransitionsManager = new TransitionsManager()

function Header() {

  usePlayIn(headerTransitionsManager, async (done, options) => {
    await myPlayIn()
    done()
  })

  usePlayOut(headerTransitionsManager, async (done, options) => {
    await myPlayOut()
    done()
  })

  return <header>...</header>
}

export default TransitionsHoc(Header, headerTransitionsManager)
```

Now, from anywhere in the application, you can play the component via his own
transitionsManager instance.

```js
await headerTransitionsManager.playIn()
// now, the transtion is done.
```

`headerTransitionsManager.playIn()` will execute the transition function
of `usePlayIn` hook defined previously in Header component. This method return a
promise that will be resolved when the transition is done with `done()` function
from the same hook. Of course, "awaiting" the promise is not mandatory.

The `TransitionsHoc` function will mount and unmount automatically the component
before play out and after play out. It's possible to only play in and play out
without destroy the component with `autoMountUnmount` option:

```ts
const headerTransitionsManager = new TransitionsManager({ autoMountUnmount: false })
```

### playIn and playOut with options parameters 

`playIn` and `playOut` methods accept options parameters witch can be dispatch
with playState.

From anywhere:
```ts
headerTransitionsManager.playIn({ duration: 0 })
```

From the components:
```tsx
  usePlayIn(headerTransitionsManager, async (done, options) => {
    // do something with options duration
    console.log(options.duration)
    done()
  })
```

Default options can be set on the manager instance:
```ts
const headerTransitionsManager = new TransitionsManager({ 
  options: {
    duration: 1
  } 
})
```

For typescript developers:
```ts
const headerTransitionsManager = new TransitionsManager<{duration?: number}>({ 
  options: {
    duration: 1
  } 
})
```

### useTransitionsManager

Instead of handle the transitionsManager play state with `usePlayIn`
and `usePlayOut` hooks, you can use the `useTransitionsManager` hook in your
component.

This one returns the current play state of the transitionsManager instance when
it changes. In this case, you have to execute the `playInComplete`
and `playOutComplete` functions when the transition is done.

```tsx
useTransitionsManager(headerTransitionsManager, async (playState, options) => {
  if (playState === "play-in") {
    await myPlayIn()
    headerTransitionsManager.playInComplete()
  }
  if (playState === "play-out") {
    await myPlayOut()
    headerTransitionsManager.playOutComplete()
  }
})

// or get state from useTransitionsManager hook
const {playState, options} = useTransitionsManager(headerTransitionsManager)
// ...
```

### Mount and unmount manually (old API)

If `TransitionsHoc` wrapper is not used, the mount and unmount component state
can be managed manually. By using `useIsMount` hook from the parent component,
you can check the mount and unmount boolean state to condition the rendering.

```tsx
const App = () => {
  const mountHeader = useIsMount(headerTransitionsManager)
  return <div>{mountHeader && <Header/>}</div>
}
```

Now, you can mount and unmount the component.

`playIn` method will call `mount` methods before is execution, and `playOut`
will call `unmount` methods after is execution automatically.

```ts
await headerTransitionsManager.playIn() // auto mount + playIn
// ...
await headerTransitionsManager.playOut() // playOut + auto unmount
```

If the `autoMountUnmount` option is disable, you will have to mount and unmount
manually the component as below:

```ts
await headerTransitionsManager.mount()
await headerTransitionsManager.playIn()
// ...
await headerTransitionsManager.playOut()
await headerTransitionsManager.unmount()
```

## debugging

[@wbe/debug](https://github.com/willybrauner/debug) is used on this project. It
allows to easily get logs informations on development and production modes.

- To use it, add this line in your browser console:

```
localStorage.debug = "TransitionsManager:*"
```

- Optionally, pass a name parameter to the instance to print it in the debug
  namespace.

```ts
const headerTransitionsManager = new TransitionsManager({name: "Header"})
```

## API usage

### Mount

`mount(): Promise<void>`

`mountComplete(): void`

### Unmount

`unmount(): Promise<void>`

`unmountComplete(): void`

### PlayIn

`playIn(options?: Partials<string, any>): Promise<void>`

`playInComplete(): void`

### PlayOut

`playOut(options?: Partials<string, any>): Promise<void>`

`playOutComplete(): void`

## Utils

**`stagger(delay: number = 1, anims: (()=> any)[]): [promise: () => Promise<any>, cancel: () => void]`**

In some case, you want to execute a list of transitions in a staggered way.
Staggered transition can be setted with the util `stagger` function.

```ts
import {stagger} from "@cher-ami/transitions-manager"

const [start, clear] = stagger(0.1, [
  headerTransitionsManager.playIn,
  FooterTransitionsManager.playIn,
])

// start staggered transition
await start()

// clear staggered transition if needed
clear()
```

<p align="center">
  <img src="/screen-stagger.gif"/>
</p>

## Example

```shell
npm i
```

Start dev server

```shell
npm run dev
```

## Licence

[MIT](./LICENSE)

## Credits

[Willy Brauner](https://github.com/willybrauner)
