import { exec } from "child_process";
import { consola } from "consola";
import { getRandomPort } from "get-port-please";
import { getState, setState } from "./state.mjs";
import { listenForAuth, postAPI } from "./api.mjs";

export const login = async() => {
    const PORT = await getRandomPort();
    consola.log("Visit https://voidone.dev/auth?session=" + PORT);
    exec(`start "" "https://github.com/login/oauth/authorize?client_id=Ov23lidPhQrIYTm8Z4Ot&redirect_uri=https://voidone.dev/auth?session=${PORT}"`);
    consola.start("Waiting for login...");
    const code = await listenForAuth(PORT);
    consola.success("Login completed!");
    setState({
        session_token: code,
    })
    return code;
}

export const link = async() =>{
    const state = getState();

    //@ts-ignore consola returns a string here... https://github.com/unjs/consola/issues/237
    const choice = await consola.prompt("Would you like to create a new app or link an existing one?",{
        type: "select",
        options: [
            {
                label: "Create a new app",
                value: "create",
            },
            {
                label: "Link an existing app",
                value: "link",
            },
        ],
    }) as string;

    if(choice === "link"){
        const apps = await postAPI<{name:string,id:string,status:string}[]>('/apps/get',{},{"Authorization": `Bearer ${state.session_token}`});
        
        if(apps.length === 0){
            consola.warn("You don't have any apps linked to your account! Creating one instead...");
        }else{
            //@ts-ignore consola returns a string here... https://github.com/unjs/consola/issues/237
            const app = await consola.prompt("Which app would you like to link?",{
                type: "select",
                options: apps.map(app => ({
                    label: app.name,
                    value: app.id,
                })),
            }) as string;
            setState({
                app_id: app,
            })
            consola.success(`Linked!`);
            return
        }
    }
    let appCreated = false;
    while(!appCreated){
        const appName = await consola.prompt("What is the name of your new app?",{
            type: "text",
            name: "name",
        })
        try{
            const { id } = await postAPI<{id:string}>('/app/create',{
                name:appName.trim()
            },{
                'Authorization': `Bearer ${state.session_token}`
            })

            setState({
                app_id: id,
            })
            consola.success(`Created ${appName}!`);
            appCreated = true;
        }catch(e){
            consola.error(`${e}\nRetrying...`);
        }
    }
}



export const initApp = async() => {
    consola.info("To begin, please login to your VoidOne account.");
    await login();
    await link();
}