import { ArgsDef, CommandContext, defineCommand } from "citty";
import { consola } from "consola";
import { initApp } from "../lib/account.mjs";
import { createConfigFile, getConfig, getState } from "../lib/state.mjs";

export default defineCommand({
    meta: {
      name: "deploy",
      description: "Deploy your app to VoidOne",
    },
    async run({ args }) {
      const state = getState();
      if(!state.session_token || !state.app_id){
          const reply = await consola.prompt(
            `No VoidOne app found. Would you like to initialize/link an app in this directory?`,
            {
              type: "confirm",
            })
          if(!reply) return;

          await initApp();
          this.run!({ args } as CommandContext<ArgsDef>);
          return;
      }

      const config = getConfig();
      if(!config.deployFolder){
        await createConfigFile();
        this.run!({ args } as CommandContext<ArgsDef>);
        return;
      }

      consola.info(`Deploying!`);
    },
});