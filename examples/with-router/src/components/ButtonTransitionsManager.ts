import { TransitionsManager } from "@cher-ami/transitions-manager";

interface Options {
  duration?: number;
}

export const ButtonTransitionsManager = new TransitionsManager<Options>({
  autoMountUnmount: true,
  name: "Button",
});
