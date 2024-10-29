import { ArgsDef, CommandContext, defineCommand } from "citty";
import { consola } from "consola";
import { initApp } from "../lib/account.mjs";

export default defineCommand({
    meta: {
      name: "deploy",
      description: "Deploy your app to VoidOne",
    },
    async run({ args }) {
      try {
        consola.info(`Deploying!`);
      } catch (e:any) {
        if(e.message === "NO STATE"){
           const reply = await consola.prompt(
            `No VoidOne app found. Would you like to initialize/link an app in this directory?`,
            {
              type: "confirm",
            })
          if(!reply) return;

          await initApp();
          this.run!({ args } as CommandContext<ArgsDef>);
          return;
        }else{
          throw e;
        }
      }
    },
});