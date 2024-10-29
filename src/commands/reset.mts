import { defineCommand } from "citty";
import { consola } from "consola";
import { clearState, State } from "../lib/state.mjs";

export default defineCommand({
    meta: {
      name: "reset",
      description: "Logout / unlink this project from VoidOne",
    },
    args:{
      key:{
        //@ts-ignore not in types?
        type:"enum",
        description: "Unlink <account|app> from this project",
        required: false,
        options: ["account","app"],
      }
    },
    async run({ args }) {
      const key = args.key as string | undefined;
      if(key && !["account","app"].includes(key)){
        consola.error("Invalid key. Please choose either `account` or `app`");
        return;
      }

      const keyMap = {
        account: "session_token",
        app: "app_id",
      } as Record<string,keyof State>;

      const confirm = await consola.prompt(`Are you sure you want to ${key ? `unlink your ${key}` : `clear all user data`} from this project from VoidOne?`,{
        type: "confirm",
      })
      if(!confirm) return;
      clearState(keyMap[key || ""]);
      consola.success("CLI state cleared!");
    },
}); 