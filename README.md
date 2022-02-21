# Transitions manager

TransitionsManager allows to handle and dispatch transitions state from anywhere in the application.
It was design for React component transitions but the manager can be used standelone too.

## Usage

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

## debugging

[@wbe/debug](https://github.com/willybrauner/debug) is used on this project. It allows to easily get logs informations on development and production modes.

- To use it, add this line in your browser console:

```
localStorage.debug = "TransitionsManager:*"
```

- Optionaly, pass a name param to the instance allows to print it on the debug namespace.

```ts
Header.transitionsManager = new TransitionsManager({ name: "Header" })
```

## API usage

### Mount

**`mount(): Promise<void>`**

**`mountComplete(): void`**

### Unmount

**`unmount(): Promise<void>`**

**`unmountComplete(): void`**

### PlayIn

**`playIn(): Promise<void>`**

**`playInComplete(): void`**

### PlayOut

**`playOut(): Promise<void>`**

**`playOutComplete(): void`**

## Dependencies

## Example

```shell
npm i
```

Start dev server

```shell
npm run dev
```
