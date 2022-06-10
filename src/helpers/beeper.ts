type THandler<S, O> = (state?: S, options?: O) => void
type THandlers<S, O> = (THandler<S, O>|void)[]

/**
 * Beeper
 * A simple Emitter witch can dispatch state and option object
 * Inspire by solid-js/signal
 * @param initialState
 * @param initialOptions
 */
export function beeper<S = any, O extends Record<string, any> = {}>(initialState: S = null, initialOptions?: O) {
  let handlers: THandlers<S, O> = []

  let initState: S = initialState
  let initOptions: O = initialOptions || {} as O

  let currentState: S = initState
  let currentOptions: O = initOptions

  const off = (handler: THandler<S, O>): void => {
    handlers = handlers.filter((e) => e !== handler)
  }

  const on = (handler: THandler<S, O>): (handler?: THandler<S, O>) => void => {
    handlers.push(handler)
    return () => off(handler)
  }

  const dispatch = (state?: S, options?: O): THandlers<S, O> => {
    currentState = state
    currentOptions = {...currentOptions, ...options}
    return handlers.map((handler:THandler<S, O>) => handler(state, currentOptions))
  }

  const reset = (): void => {
    handlers = []
    currentState = initState
    currentOptions = initOptions
  }

  return {
    off,
    on,
    dispatch,
    reset,
    get state() { return currentState },
    get options() { return currentOptions },
    get handlers() { return handlers },
  }
}
