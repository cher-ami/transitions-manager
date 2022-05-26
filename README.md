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
export const HeaderTransitionsManager = new TransitionsManager()

function Header() {

  usePlayIn(HeaderTransitionsManager, async (done) => {
    await myPlayIn()
    done()
  })

  usePlayOut(HeaderTransitionsManager, async (done) => {
    await myPlayOut()
    done()
  })

  return <header>...</header>
}

export default TransitionsHoc(Header, HeaderTransitionsManager)
```

Now, from anywhere in the application, you can play the component via his own
transitionsManager instance.

```js
await HeaderTransitionsManager.playIn()
// now, the transtion is done.
```

`HeaderTransitionsManager.playIn()` will exectute the transition function
of `usePlayIn` hook defined previously in Header component. This method return a
promise that will be resolved when the transition is done with `done()` function
from the same hook. Of course, "awaiting" the promise is not mandatory.

The `TransitionsHoc` function will mount and unmount automatically the component
before play out and after play out. It's possible to only play in and play out
without destroy the component with `autoMountUnmount` option:

```ts
new TransitionsManager({autoMountUnmount: false})
```

### useTransitionsManager

Instead of handle the transitionsManager play state with `usePlayIn`
and `usePlayOut` hooks, you can use the `useTransitionsManager` hook in your
component.

This one returns the current play state of the transitionsManager instance when
it changes. In this case, you have to execute the `playInComplete`
and `playOutComplete` functions when the transition is done.

```ts
useTransitionsManager(HeaderTransitionsManager, async (playState) => {
  if (playState === "play-in") {
    await myPlayIn()
    HeaderTransitionsManager.playInComplete()
  }
  if (playState === "play-out") {
    await myPlayOut()
    HeaderTransitionsManager.playOutComplete()
  }
})
```

### Mount and unmount manually (old API)

If `TransitionsHoc` wrapper is not used, the mount and unmount component state
can be managed manually. By using `useIsMount` hook from the parent component,
you can check the mount and unmount boolean state to condition the rendering.

```tsx
const App = () => {
  const mountHeader = useIsMount(HeaderTransitionsManager)
  return <div>{mountHeader && <Header/>}</div>
}
```

Now, you can mount and unmount the component.

`playIn` method will call `mount` methods before is execution, and `playOut`
will call `unmount` methods after is execution automatically.

```ts
await HeaderTransitionsManager.playIn() // auto mount + playIn
// ...
await HeaderTransitionsManager.playOut() // playOut + auto unmount
```

If the `autoMountUnmount` option is disable, you will have to mount and unmount
manually the component as below:

```ts
await HeaderTransitionsManager.mount()
await HeaderTransitionsManager.playIn()
// ...
await HeaderTransitionsManager.playOut()
await HeaderTransitionsManager.unmount()
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
HeaderTransitionsManager = new TransitionsManager({name: "Header"})
```

## API usage

### Mount

`mount(): Promise<void>`

`mountComplete(): void`

### Unmount

`unmount(): Promise<void>`

`unmountComplete(): void`

### PlayIn

`playIn(): Promise<void>`

`playInComplete(): void`

### PlayOut

`playOut(): Promise<void>`

`playOutComplete(): void`

## Utils

**`stagger(delay: number = 1, anims: (()=> any)[]): [promise: () => Promise<any>, cancel: () => void]`**

In some case, you want to execute a list of transitions in a staggered way.
Staggered transition can be setted with the util `stagger` function.

```ts
import {stagger} from "@cher-ami/transitions-manager"

const [start, clear] = stagger(0.1, [
  HeaderTransitionsManager.playIn,
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
