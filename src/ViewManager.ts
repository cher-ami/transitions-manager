import { StateSignal } from "@solid-js/signal"
import debug from "@wbe/debug"
import { deferredPromise, TDeferredPromise } from "@wbe/deferred-promise"

const componentName = "ViewManager"
const log = debug(`front:${componentName}`)

export type TPlayState = "hidden" | "play-out" | "play-in" | "visible"
export type TMountState = "mount" | "unmount"

type TContructor = {
  autoMountUnmount?: boolean
  logName?: string
  showLog?: boolean
}

export class ViewManager {
  protected autoMountUnmount: boolean
  protected logName: string
  protected showLog: boolean

  constructor({ autoMountUnmount = true, logName = "", showLog = false }: TContructor) {
    this.autoMountUnmount = autoMountUnmount
    this.logName = logName
    this.showLog = showLog
  }

  public mountStateSignal = StateSignal<TMountState>("unmount")
  protected mountDeferred: TDeferredPromise<void>
  protected unmountDeferred: TDeferredPromise<void>

  public playStateSignal = StateSignal<TPlayState>("hidden")
  protected playInDeferred: TDeferredPromise<void>
  protected playOutDeferred: TDeferredPromise<void>

  // ------------------------------------------------------------------------- MOUNT / UNMOUNT

  public mount(): Promise<void> {
    this.showLog && log(this.logName, "mount")
    if (this.mountStateSignal.state !== "unmount") {
      this.showLog && log(this.logName, "Component is not unmount, return.")
      return
    }
    this.mountDeferred = deferredPromise<void>()
    this.mountStateSignal.dispatch("mount")
    return this.mountDeferred.promise
  }

  public mountComplete(): void {
    this.showLog && log(this.logName, "mount Complete")
    this.mountDeferred.resolve()
  }

  public unmount(): Promise<void> {
    this.showLog && log(this.logName, "unmount")
    if (this.mountStateSignal.state !== "mount") {
      this.showLog && log(this.logName, "Component is not mount, return.")
      return
    }
    this.unmountDeferred = deferredPromise<void>()
    this.mountStateSignal.dispatch("unmount")
    return this.unmountDeferred.promise
  }

  public unmountComplete(): void {
    this.showLog && log(this.logName, "unmount Complete")
    this.unmountDeferred?.resolve()
  }

  // ------------------------------------------------------------------------- PLAYIN / PLAYOUT

  public async playIn(): Promise<void> {
    if (this.autoMountUnmount) {
      log(this.logName, "> auto mount")
      await this.mount()
    }

    this.showLog && log(this.logName, "playIn")
    this.playInDeferred = deferredPromise<void>()
    this.playStateSignal.dispatch("play-in")
    return this.playInDeferred.promise
  }

  public playInComplete(): void {
    this.showLog && log(this.logName, "playIn Complete")
    this.playStateSignal.dispatch("visible")
    this.playInDeferred?.resolve()
  }

  public playOut(): Promise<void> {
    this.showLog && log(this.logName, "playOut")
    this.playOutDeferred = deferredPromise<void>()
    this.playStateSignal.dispatch("play-out")
    return this.playOutDeferred.promise
  }

  public playOutComplete(): void {
    this.showLog && log(this.logName, "playOut Complete")
    this.playStateSignal.dispatch("hidden")
    this.playOutDeferred?.resolve()
    if (this.autoMountUnmount) {
      log(this.logName, "> auto unmount")
      this.unmount()
    }
  }
}
