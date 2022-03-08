import { StateSignal } from "@solid-js/signal"
import debug from "@wbe/debug"
import { deferredPromise, TDeferredPromise } from "@wbe/deferred-promise"

const componentName = "TransitionsManager"
export type TPlayState = "hidden" | "play-out" | "play-in" | "visible"
export type TMountState = "mount" | "unmount"

type TContructor = {
  autoMountUnmount?: boolean
  name?: string
}

export class TransitionsManager {
  protected autoMountUnmount: boolean
  protected name: string
  protected log

  constructor({ autoMountUnmount = false, name = null }: TContructor) {
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
    this.log("mount Complete")
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

  public  playIn = async (): Promise<void> => {
    if (this.autoMountUnmount) {
      this.log("> auto mount")
      await this.mount()
    }

    this.log("playIn")
    this.playInDeferred = deferredPromise<void>()
    this.playStateSignal.dispatch("play-in")
    return this.playInDeferred.promise
  }

  public playInComplete(): void {
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

  public playOutComplete(): void {
    this.log("playOut Complete")
    this.playStateSignal.dispatch("hidden")
    this.playOutDeferred?.resolve()
    if (this.autoMountUnmount) {
      this.log("> auto unmount")
      this.unmount()
    }
  }
}
