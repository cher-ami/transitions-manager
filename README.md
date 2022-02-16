# ViewManager

ViewManager allows to handle and dispatch transitions state from anywhere in the application.
It was design for React component transitions but the manager can be used standelone too.

## React usage

Create a new viewManager instance, as static, on a React component.  
Then, when handle the manager play-state with `usePlayIn` and `usePlayOut` hooks.

```ts
Header.viewManager = new ViewManager()

function Header() {

  usePlayIn(Header.viewManager, async (done) => {
    await myPlayIn()
    done()
  })
  
  usePlayOut(Header.viewManager, async (done) => {
    await myPlayOut()
    done()
  })

  return ...
}
```

Now, from anywhere in the application, you can play the component via his own viewManager instance.

For exemple, `Header.viewManager.playIn()` will exectute the transition function of `usePlayIn` hook defined previously in Header component.
This method return a promise that will be resolved when the transition is done with `done()` function from the same hook.

```js
await Header.viewManager.playIn()
// now, the transtion is done.
```

Of course, "awaiting" the promise is not mandatory.

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
npm i & lerna bootstrap
```

Start dev server from this package

```shell
npm run dev
```
