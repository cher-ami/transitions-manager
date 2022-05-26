import { StateSignal } from "@solid-js/signal"
import debug from "@wbe/debug"

const componentName = "TransitionsManager"
export type TPlayState = "hidden" | "play-out" | "play-in" | "visible"
export type TMountState = "mount" | "unmount"

export type TDeferredPromise<T> = {
  promise: Promise<T>;
  resolve: (resolve?: T) => void;
  reject: (error?: Error | any) => void;
};

/**
 * @name deferredPromise
 * @return TDeferredPromise
 */
export function deferredPromise<T>(): TDeferredPromise<T> {
  const deferred: TDeferredPromise<T> | any = {};
  deferred.promise = new Promise((resolve, reject) => {
    deferred.resolve = resolve;
    deferred.reject = reject;
  });
  return deferred;
}

/**
 * TransitionsManager
 */
export class TransitionsManager {
  public autoMountUnmount: boolean
  public name: string
  protected log

  constructor({ autoMountUnmount = true, name = null }: {
    autoMountUnmount?: boolean
    name?: string
  } = {}) {
    this.autoMountUnmount = autoMountUnmount
    this.name = name
    this.log = debug(
      [componentName, this.name != null && `:${this.name}`].filter((e) => e).join("")
    )
  }

  public mountStateSignal = StateSignal<TMountState>("unmount")
  protected mountDeferred: TDeferredPromise<void>
  protected unmountDeferred: TDeferredPromise<void>

  public playStateSignal = StateSignal<TPlayState>("hidden")
  protected playInDeferred: TDeferredPromise<void>
  protected playOutDeferred: TDeferredPromise<void>

  // ------------------------------------------------------------------------- MOUNT / UNMOUNT

  public mount(): Promise<void> {
    this.log("mount")
    if (this.mountStateSignal.state !== "unmount") {
      this.log("Component is not unmount, return.")
      return
    }
    this.mountDeferred = deferredPromise<void>()
    this.mountStateSignal.dispatch("mount")
    return this.mountDeferred.promise
  }

  public mountComplete(): void {
    this.log("mount Complete", this.mountDeferred)
    this.mountDeferred.resolve()
  }

  public unmount(): Promise<void> {
    this.log("unmount")
    if (this.mountStateSignal.state !== "mount") {
      this.log("Component is not mount, return.")
      return
    }
    this.unmountDeferred = deferredPromise<void>()
    this.mountStateSignal.dispatch("unmount")
    return this.unmountDeferred.promise
  }

  public unmountComplete(): void {
    this.log("unmount Complete")
    this.unmountDeferred?.resolve()
  }

  // ------------------------------------------------------------------------- PLAYIN / PLAYOUT

  public playIn = async (): Promise<void> => {
    if (this.autoMountUnmount) {
      this.log("> auto mount")
      await this.mount()
    }
    this.playInDeferred = deferredPromise<void>()
    // wait next frame to be sure the component is mounted and listen playStateSignal
    await new Promise((resolve:any) => {
      setTimeout(()=> {
        this.log("playIn (with 10ms delay)")
        this.playStateSignal.dispatch("play-in")
        resolve()
      }, 10)
    })
    return this.playInDeferred.promise
  }

  public playInComplete = (): void => {
    this.log("playIn Complete")
    this.playStateSignal.dispatch("visible")
    this.playInDeferred?.resolve()
  }

  public playOut = async (): Promise<void> => {
    this.log("playOut")
    this.playOutDeferred = deferredPromise<void>()
    this.playStateSignal.dispatch("play-out")
    return this.playOutDeferred.promise
  }

  public playOutComplete = (): void => {
    this.log("playOut Complete")
    this.playStateSignal.dispatch("hidden")
    this.playOutDeferred?.resolve()
    if (this.autoMountUnmount) {
      this.log("> auto unmount")
      this.unmount()
    }
  }
}
