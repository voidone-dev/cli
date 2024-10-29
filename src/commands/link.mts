import { defineCommand } from "citty";
import { consola } from "consola";
import { link, login } from "../lib/account.mjs";
import { getState } from "../lib/state.mjs";

export default defineCommand({
    meta: {
      name: "link",
      description: "Link your VoidOne app to this project",
    },
    async run({ args }) {
      const state = getState();
      if(!state.session_token){
        consola.warn("Please login to your VoidOne account first!");
        await login();
        this.run!({ args } as any);
        return;
      }
      
      consola.info("To begin, please login to your VoidOne account.");
      await link();
    },
});