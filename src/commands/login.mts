import { defineCommand } from "citty";
import { consola } from "consola";
import { login } from "../lib/account.mjs";

export default defineCommand({
    meta: {
      name: "login",
      description: "Login to your VoidOne account",
    },
    async run({ args }) {
      consola.info("To begin, please login to your VoidOne account.");
      await login();
    },
});