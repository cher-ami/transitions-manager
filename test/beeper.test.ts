import {beeper} from "../src/helpers/beeper"
const { log } = console


describe("beeper", ()=>
{



  it("should return initial state", () => {
    const bee = beeper<string>("hello")
    expect(bee.state).toBe("hello")
  })

  it("should 'on' & 'off' properly", () => {
    const bee = beeper<string>('initial')
    let response
    const handler = (state:string) => {
      response = state
    }
    // On
    bee.on(handler)
    bee.dispatch("ON!")
    expect(response).toBe("ON!")
    // Off
    bee.off(handler)
    bee.dispatch("OFF!")
    expect(response).toBe("ON!")
  })

  it('should register and unregister.handlers properly', () =>
  {
      const bee = beeper()
      const handler1 = () => {}
      bee.on(handler1)
      const handler2 = () => {}
      bee.on(handler2)
      expect(bee.handlers).toStrictEqual([handler1, handler2])
      bee.off(handler1)
      expect(bee.handlers).toStrictEqual([handler2])
      bee.off(handler2)
      expect(bee.handlers).toStrictEqual([])
  })

  it('should return the current state', () =>
  {
    const bee = beeper<number>(10)
    expect(bee.state).toBe(10)
    bee.dispatch(20)
    expect(bee.state).toBe(20)
  })

  it("should clear handlers when 'reset' method is executed", ()=> {
      const bee = beeper()
      bee.on(() => {})
      bee.on(() => {})
      expect(bee.handlers.length).toBe(2)
      bee.reset()
      expect(bee.handlers.length).toBe(0)
      expect(bee.handlers).toStrictEqual([])
  })

  it("'on' should return 'off' method", ()=>
  {
      const bee = beeper()
      let response = bee.state
      const handler = (state:string) => response = state
      const off = bee.on(handler)
      // process off
      off(handler)
      bee.dispatch('foo')
      bee.dispatch('fooooo')
      expect(response).toBe(null)
  })

  it("should return default options", ()=> {
    const bee = beeper()
    expect(bee.options).toStrictEqual({})

    const opt = {duration: 0}
    const bee2 = beeper<string, {duration?: number}>("state", opt)
    expect(bee2.options).toStrictEqual(opt)

  })

  it("should dispatch options", ()=>
  {
    const bee = beeper<string, {duration?: number, ease?: string}>()

    let listenOptions
    bee.on((state, options)=> {
      listenOptions = options
    })

    bee.dispatch('foo')
    expect(bee.options).toStrictEqual({})
    expect(listenOptions).toStrictEqual({})

    bee.dispatch('foo', {duration: 2})
    expect(bee.options).toStrictEqual( {duration: 2})
    expect(listenOptions).toStrictEqual( {duration: 2})

    bee.dispatch('foo', {ease: "out"})
    expect(bee.options).toStrictEqual( {duration: 2, ease:"out"})
    expect(listenOptions).toStrictEqual( {duration: 2, ease:"out"})

  })

  it("should restore initial state and options when 'reset' method is executed", () => {

    const bee = beeper<string, {duration?: number}>("first", {duration: 1})

    let listenState
    let listenOptions
    bee.on((state, options) => {
      listenState = state
      listenOptions = options
    })

    bee.dispatch('second', {duration: 2})
    expect(listenState).toStrictEqual("second")
    expect(listenOptions).toStrictEqual({duration: 2})

    bee.reset()
    expect(bee.state).toBe("first")
    expect(bee.options).toStrictEqual({duration: 1})

  })

})
