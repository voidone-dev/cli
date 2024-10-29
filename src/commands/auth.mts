import { defineCommand } from "citty";

export default defineCommand({
    meta: {
      name: "auth",
      description: "Manage your account authentication",
    },
    run({ args }) {
      console.log("auth");
    },
}); 