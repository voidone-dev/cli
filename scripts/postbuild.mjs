import { writeFileSync, readFileSync } from "fs";
const index = readFileSync("./dist/index.mjs", "utf-8");
writeFileSync("./dist/index.mjs", `#!/usr/bin/env node\n${index}`);