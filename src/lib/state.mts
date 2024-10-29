import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync } from "fs";
import { consola } from "consola";

interface State {
    session_token: string;
    app_id: string;
}

const HOME_DIR = process.env.VOIDONE_HOME || ".voidone";

let stateCache = null as State | null;

export const getState = () => {
    try{
        if(stateCache) return stateCache;
        const state = JSON.parse(readFileSync(`./${HOME_DIR}/state.json`, "utf-8"));
        if(!state.session_token || !state.app_id){
            throw new Error("Invalid state file. Please run `voidone reset` to reset your CLI state.");
        }
        return state;
    }catch(e:any){
        if(e.code === "ENOENT"){
            throw new Error("NO STATE")
        }
        throw e;
    }
}

export const setState = (merge: Partial<State>) => {
    let state = {
        session_token: "",
        app_id: "",
    } as State;

    try{
        state = getState();
    }catch(e:any){}

    stateCache = {
        ...state,
        ...merge,
    };
    if(!existsSync(`./${HOME_DIR}`)){
        mkdirSync(`./${HOME_DIR}`);
        //Modify gitignore if it exists
        if(existsSync(`.gitignore`)){
            appendFileSync(`.gitignore`, "\n# VoidOne CLI\n.voidone\n");
        }
    }
    writeFileSync(`./${HOME_DIR}/state.json`, JSON.stringify(stateCache));
}

export interface Config{
    /**
     * The folder to deploy from. Usually a build output folder.
     */
     deployFolder: string;
}

export const createConfigFile = async () => {
    if(existsSync(`./voidone.json`)){
        return;
    }

    const deployPath = await consola.prompt("What is your deployment folder? (this is usually the build output folder)",{
        type: "text",
        name: "deployFolder",
        placeholder: "./dist",
    }) || "./dist";

    const config = {
        deployFolder: deployPath.trim(),
    } as Config;

    writeFileSync(`./voidone.json`, JSON.stringify(config, null, 2));
}

        