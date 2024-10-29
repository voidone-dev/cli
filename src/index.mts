import { defineCommand, runMain } from "citty";

import auth from "./commands/auth.mjs";
import deploy from "./commands/deploy.mjs";

const subCommands = {
    auth,
    deploy,
}

const main = defineCommand({
  meta: {
    name: "voidone",
    version: "0.0.1",
    description: "The offical command line interface for deploying and managing VoidOne apps.",
  },
  subCommands
});

runMain(main);