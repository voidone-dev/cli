import { readFileSync, writeFileSync, existsSync, mkdirSync, appendFileSync, rmSync } from "fs";
import { consola } from "consola";

export interface State {
    session_token: string;
    app_id: string;
}

const HOME_DIR = process.env.VOIDONE_HOME || ".voidone";

let stateCache = null as Partial<State> | null;

export const getState = ():Partial<State> => {
    try{
        if(stateCache) return stateCache;
        const state = JSON.parse(readFileSync(`./${HOME_DIR}/state.json`, "utf-8"));
        if(!state.session_token && !state.app_id){
            throw new Error("Invalid state file. Please run `voidone reset` to reset your CLI state.");
        }
        stateCache = state;
        return state;
    }catch(e:any){
        if(e.code === "ENOENT"){
            stateCache = {}
            return {}
        }
        throw e;
    }
}

export const setState = (merge: Partial<State>,force?:boolean) => {
    let state = {
        session_token: "",
        app_id: "",
    } as Partial<State>;

    try{
        state = getState();
    }catch(e:any){}

    stateCache = (force) ? merge : {
        ...state,
        ...merge
    } as Partial<State>;

    if(!existsSync(`./${HOME_DIR}`)){
        mkdirSync(`./${HOME_DIR}`);
        //Modify gitignore if it exists
        if(existsSync(`./.gitignore`)){
            const gitignore = readFileSync(`./.gitignore`, "utf-8");
            if(!gitignore.includes("# VoidOne CLI")){
                appendFileSync(`../gitignore`, "\n# VoidOne CLI\n.voidone\n");
            }
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

export const getConfig = ():Partial<Config> => {
    try{
        return JSON.parse(readFileSync(`./voidone.json`, "utf-8"));
    }catch(e:any){
        if(e.code === "ENOENT"){
            return {};
        }
        throw e;
    }
}

export const clearState = (type?:keyof State) => {
    getState();
    if(!stateCache) return;
    if(!type){
        rmSync(`./${HOME_DIR}`, { recursive: true, force: true });
    }else{
        delete stateCache[type];
        setState(stateCache,true);
    }
}
        