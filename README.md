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

## Summary

- [Installation](#Installation)
- [Life cycle](#LifeCycle)
- [Vanilla usage](#VanillaUsage)
- [React usage](#ReactUsage)
  - [usePlayIn & useLayout](#UsePlayInAndUsePlayOut)
  - [useTransitionsManager](#UseTransitionsManager)
  - [mount & unmount manually](#MountUnumountManually)
- [debug](#Debug)
- [Api](#API)
- [Utils](#Utils)
- [Example](#Example)

## <a name="Installation"></a>Installation

```
npm i @cher-ami/transitions-manager
```

## <a name="LifeCycle"></a>Life cycle

`TransitionsManager` allows to handle and dispatch two types of states:

- mountState `mount | unmount`
- playState `hidden | play-in | visible | play-out`

The life cycle of a single transition order could be:

- `mount` (mountState)
- `play-in` (playState)
- `visible` (playState)
- `play-out` (playState)
- `hidden` (playState) - default
- `unmount` (mountState) - default

It's possible to manage a transitions without using the mountState and only working with playState. The mountState is useful specificaly about the React usage.

## <a name="VanillaUsage"></a>Vanilla usage

Create a new instance to manager the transitions of your component:
```ts
export const componentTransitionsManager = new TransitionsManager()
```

Listen `mountState` change:
```ts
const handleMountState = (mountState) => {
  if (mountState === "mount") {
    // do somthing and resolve mountState
    componentTransitionsManager.mountComplete()
  }
  if (mountState === "unmount") {
    // do somthing and resolve mountState
    componentTransitionsManager.unmountComplete()
  }
}
// start to listen
componentTransitionsManager.mountStateSignal.on(handleMountState)
// stop...
componentTransitionsManager.mountStateSignal.off(handleMountState)
```

Listen `playState` change on the same way:
```ts
const handlePlayState = (playState) => {
  if (playState === "play-in") {
    // do something and resolve transition state
    componentTransitionsManager.playInComplete()
  }
  if (playState === "play-out") {
    // do something and resolve transition state
    componentTransitionsManager.playOutComplete()
  }
}
// start to listen
componentTransitionsManager.playStateSignal.on(handlePlayState)
// stop...
componentTransitionsManager.playStateSignal.off(handlePlayState)
```

Now from anywhere, dispatch a new transition state with these methods

````shell
componentTransitionsManager.mount()
componentTransitionsManager.playIn()
componentTransitionsManager.playOut()
componentTransitionsManager.unmount()
````

### <a name="OptionsParameters"></a>Options parameters

`playIn` and `playOut` methods accept options parameters.

```ts
componentTransitionsManager.playIn({ duration: 0 })
```

From the components:
```ts
componentTransitionsManager.playStateSignal.on((playState, options) => {
  console.log(options) // { duration: 0 }
})
```

Default options can be set on the manager instance:
```ts
const componentTransitionsManager = new TransitionsManager({ 
  options: {
    duration: 1
  } 
})
```

For typescript developers, GOption generic type is available on instance
```ts
const componentTransitionsManager = new TransitionsManager<{duration?: number}>({ 
  options: {
    duration: 1
  } 
})
```

## <a name="ReactUsage"></a>React usage

`TransitionsManager` is ready to use with vanilla javascript as above but it has been built for a React usage too. The API comes with hooks!

### <a name="UsePlayInAndUsePlayOut"></a>usePlayIn & usePlayOut

1. Create a new transitionsManager instance as above
2. Wrap your component by `TransitionsHoc(component, manager)`
3. Then, define transitions in `usePlayIn` and `usePlayOut` hooks callback.


````ts
export const componentTransitionsManager = new TransitionsManager()
````

```tsx
function Component() {
  usePlayIn(componentTransitionsManager, async (done, options) => {
    await myPlayIn()
    done()
  })
  usePlayOut(componentTransitionsManager, async (done, options) => {
    await myPlayOut()
    done()
  })
  return <div>...</div>
}

export default TransitionsHoc(Component, componentTransitionsManager)
```

Now, from anywhere in the application, you can play the component via `componentTransitionsManager` his own transitionsManager instance.

```js
await componentTransitionsManager.playIn()
// now, the transtion is done.
```


`componentTransitionsManager.playIn()` will execute the transition function
of `usePlayIn` hook defined previously in Component. This method returns a
promise that will be resolved when the transition is done with `done()` function
from the same hook. Of course, "awaiting" the promise is not mandatory.

The `TransitionsHoc` function will mount and unmount automatically the component
before play out and after play out. It's possible to only play in and play out
without destroy the component with `autoMountUnmount` option:

```ts
const componentTransitionsManager = new TransitionsManager({ autoMountUnmount: false })
```

### <a name="UseTransitionsManager"></a>useTransitionsManager

Instead of handle the transitionsManager playState with `usePlayIn`
and `usePlayOut` hooks, you can use the `useTransitionsManager` hook in your
component.

This one returns the current playState of the transitionsManager instance when
it changes. In this case, you have to execute the `playInComplete`
and `playOutComplete` functions when the transition is done.

```tsx
useTransitionsManager(componentTransitionsManager, async (playState, options) => {
  if (playState === "play-in") {
    await myPlayIn()
    componentTransitionsManager.playInComplete()
  }
  if (playState === "play-out") {
    await myPlayOut()
    componentTransitionsManager.playOutComplete()
  }
})

// or get state from useTransitionsManager hook
const {playState, options} = useTransitionsManager(componentTransitionsManager)
// ...
```

### <a name="MountUnumountManually"></a>Mount and unmount manually (old API)

If `TransitionsHoc` wrapper is not used, the mount and unmount component state
can be managed manually. By using `useIsMount` hook from the parent component,
you can check the mount and unmount boolean state to condition the rendering.

```tsx
const App = () => {
  const mountComponent = useIsMount(componentTransitionsManager)
  return <div>{mountComponent && <Component/>}</div>
}
```

Now, you can mount and unmount the component.

`playIn` method will call `mount` methods before is execution, and `playOut`
will call `unmount` methods after is execution automatically.

```ts
await componentTransitionsManager.playIn() // auto mount + playIn
// ...
await componentTransitionsManager.playOut() // playOut + auto unmount
```

If the `autoMountUnmount` option is disable, you will have to mount and unmount
manually the component as below:

```ts
await componentTransitionsManager.mount()
await componentTransitionsManager.playIn()
// ...
await componentTransitionsManager.playOut()
await componentTransitionsManager.unmount()
```

## <a name="Debug"></a>Debug

[@wbe/debug](https://github.com/willybrauner/debug) is used on this project. It
allows to easily get logs information on development and production modes.

- To use it, add this line in your browser console:

```
localStorage.debug = "TransitionsManager:*"
```

- Optionally, pass a name parameter to the instance to print it in the debug
  namespace.

```ts
const componentTransitionsManager = new TransitionsManager({name: "Component"})
```

## <a name="Api"></a>API

### TransitionsManager constructor

`{ name?: string, autoMountUnmount?: boolean, options?: Record<any, any> }`
- `name` (optional) used by debug as namespace
- `autoMountUnmount` (optional) playIn will auto mount, playOut will auto unmount - default is true
- `options` (optional) list of default playIn and playOut options


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

## <a name="Utils"></a>Utils

**`stagger(delay: number = 1, anims: (()=> any)[]): [promise: () => Promise<any>, cancel: () => void]`**

In some case, you want to execute a list of transitions in a staggered way.
Staggered transition can be setted with the util `stagger` function.

```ts
import {stagger} from "@cher-ami/transitions-manager"

const [start, clear] = stagger(0.1, [
  componentTransitionsManager.playIn,
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

## <a name="Example">Example

```shell
pnpm i
```

Start dev server for specific example

```shell
pnpm run dev:basic
```


Start build:watch on the lib witch is symlinked to the example
```shell
pnpm run build:watch
```

Start unit tests watch during development

```shell  
pnpm run test:watch
```


## Licence

[MIT](./LICENSE)

## Credits

[Willy Brauner](https://github.com/willybrauner)
