import debug from "@cher-ami/debug";
import { deferredPromise, TDeferredPromise } from "./helpers/deferredPromise";
import { Beeper } from "./helpers/Beeper";

const componentName = "TransitionsManager";
export type TPlayState = "hidden" | "play-out" | "play-in" | "visible";
export type TMountState = "mount" | "unmount";

/**
 * TransitionsManager
 */
export class TransitionsManager<GOptions = {}> {
  public autoMountUnmount: boolean;
  public name: string;
  protected options: Record<any, any>;

  public mountStateSignal;
  protected mountDeferred: TDeferredPromise<void>;
  protected unmountDeferred: TDeferredPromise<void>;

  public playStateSignal;
  protected playInDeferred: TDeferredPromise<void>;
  protected playOutDeferred: TDeferredPromise<void>;

  private readonly log;

  constructor({
    autoMountUnmount = true,
    name = null,
    options = {},
  }: {
    autoMountUnmount?: boolean;
    name?: string;
    options?: Record<any, any>;
  } = {}) {
    this.autoMountUnmount = autoMountUnmount;
    this.name = name;
    this.log = debug(
      [componentName, this.name != null && `:${this.name}`]
        .filter((e) => e)
        .join("")
    );
    this.options = options;
    this.mountStateSignal = Beeper<TMountState>("unmount");
    this.playStateSignal = Beeper<TPlayState, GOptions>("hidden", this.options);
  }

  // ------------------------------------------------------------------------- MOUNT / UNMOUNT

  public mount(): Promise<void> {
    this.log("mount");
    if (this.mountStateSignal.state !== "unmount") {
      this.log("Component is not unmount, return.");
      return;
    }
    this.mountDeferred = deferredPromise<void>();
    this.mountStateSignal.dispatch("mount");
    return this.mountDeferred.promise;
  }

  public mountComplete(): void {
    this.log("mount Complete", this.mountDeferred);
    this.mountDeferred.resolve();
  }

  public unmount(): Promise<void> {
    this.log("unmount");
    if (this.mountStateSignal.state !== "mount") {
      this.log("Component is not mount, return.");
      return;
    }
    this.unmountDeferred = deferredPromise<void>();
    this.mountStateSignal.dispatch("unmount");
    return this.unmountDeferred.promise;
  }

  public unmountComplete(): void {
    this.log("unmount Complete");
    this.unmountDeferred?.resolve();
  }

  // ------------------------------------------------------------------------- PLAYIN / PLAYOUT

  public playIn = async (options?: GOptions): Promise<void> => {
    if (this.autoMountUnmount) {
      this.log("> auto mount");
      await this.mount();
    }
    this.playInDeferred = deferredPromise<void>();
    // wait next frame to be sure the component is mounted and listen playStateSignal
    await new Promise((resolve: any) => {
      setTimeout(() => {
        this.log("playIn (with 10ms delay)");
        this.playStateSignal.dispatch("play-in", options);
        resolve();
      }, 10);
    });
    return this.playInDeferred.promise;
  };

  public playInComplete = (): void => {
    this.log("playIn Complete");
    this.playStateSignal.dispatch("visible");
    this.playInDeferred?.resolve();
  };

  public playOut = async (options?: GOptions): Promise<void> => {
    this.log("playOut");
    this.playOutDeferred = deferredPromise<void>();
    this.playStateSignal.dispatch("play-out", options);
    return this.playOutDeferred.promise;
  };

  public playOutComplete = (): void => {
    this.log("playOut Complete");
    this.playStateSignal.dispatch("hidden");
    this.playOutDeferred?.resolve();
    if (this.autoMountUnmount) {
      this.log("> auto unmount");
      this.unmount();
    }
  };
}
