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

Create a new transitionsManager instance, as static, on a React component.  
Then, when handle the manager play state with `usePlayIn` and `usePlayOut` hooks.

```ts
Header.transitionsManager = new TransitionsManager()

function Header() {

  usePlayIn(Header.transitionsManager, async (done) => {
    await myPlayIn()
    done()
  })

  usePlayOut(Header.transitionsManager, async (done) => {
    await myPlayOut()
    done()
  })

  return ...
}
```

Now, from anywhere in the application, you can play the component via his own transitionsManager instance.

```js
await Header.transitionsManager.playIn()
// now, the transtion is done.
```

`Header.transitionsManager.playIn()` will exectute the transition function of `usePlayIn` hook defined previously in Header component.
This method return a promise that will be resolved when the transition is done with `done()` function from the same hook.
Of course, "awaiting" the promise is not mandatory.

### useTransitionsManager

Instead of handle the transitionsManager play state with `usePlayIn` and `usePlayOut` hooks,
you can use the `useTransitionsManager` hook in your component.

This one returns the current play state of the transitionsManager instance when it changes.
In this case, you have to execute the `playInComplete` and `playOutComplete` functions when the transition is done.

```ts
useTransitionsManager(Header.transitionsManager, async (playState) => {
  if (playState === "play-in") {
    await myPlayIn()
    Header.transitionsManager.playInComplete()
  }
  if (playState === "play-out") {
    await myPlayOut()
    Header.transitionsManager.playOutComplete()
  }
})
```

### Mount and unmount

At this point, the component is eable to be play-in and play-out by his own transitionsManager instance from anywhere in the application.
It's also possible to mount and unmount before and play-in and after play-out.

By using `useIsMount` hook from the parent component, you can check the mount and unmount boolean state to condition the rendering.

```ts
const App = () => {
  const mountHeader = useIsMount(Header.transitionsManager)
  return <div>{mountHeader && <Header />}</div>
}
```

Now, you can mount and unmount the component.

```ts
await Header.transitionsManager.mount()
await Header.transitionsManager.playIn()
// ...
await Header.transitionsManager.playOut()
await Header.transitionsManager.unmount()
```

Writting all the process is a bit long, but you can use the manager in a more simple way.
If you don't want to specify each time `mount` and `unmount` methods, you can pass `autoMountUnmount` param to `true` in the constructor.

```ts
Header.transitionsManager = new TransitionsManager({ autoMountUnmount: true })
```

`playIn` method will call `mount` methods before is execution, and `playOut` will call `unmount` methods after is execution automatically.
With `autoMountUnmount`, it will get the same result as in the previous example with that code:

```ts
await Header.transitionsManager.playIn() // auto mount + playIn
// ...
await Header.transitionsManager.playOut() // playOut + auto unmount
```

## debugging

[@wbe/debug](https://github.com/willybrauner/debug) is used on this project. It allows to easily get logs informations on development and production modes.

- To use it, add this line in your browser console:

```
localStorage.debug = "TransitionsManager:*"
```

- Optionally, pass a name parameter to the instance to print it in the debug namespace.

```ts
Header.transitionsManager = new TransitionsManager({ name: "Header" })
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
  Header.transitionsManager.playIn,
  Footer.transitionsManager.playIn,
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
