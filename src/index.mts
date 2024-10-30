import { defineCommand, runMain } from "citty";

import reset from "./commands/reset.mjs";
import deploy from "./commands/deploy.mjs";
import login from "./commands/login.mjs";
import link from "./commands/link.mjs";

const subCommands = {
    deploy,
    login,
    link,
    reset,
}

const main = defineCommand({
  meta: {
    name: "voidone",
    version: "0.0.3",
    description: "The offical command line interface for deploying and managing VoidOne apps.",
  },
  subCommands
});

runMain(main);