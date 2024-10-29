import { createServer } from "http"
import { consola } from "consola";
import { login } from "./account.mjs";

export async function postAPI<T>(route:string,body:any,headers?:Record<string,string>,skipJSON?:boolean){
    const res = await fetch(`https://voidone.dev/api${route}`,{
        method:"POST",
        body:(skipJSON) ? body : JSON.stringify(body),
        headers
    })
    if(!res.ok){
        if (res.status >= 500 && res.status < 600){
            throw new Error(`Server: ${res.statusText}`)
        }
    }
    const json = await res.json() as any
    if(json.error){
        if(json.error.includes("expire")){
            consola.error("Your session has expired. Please login again.");
            await login();
            await postAPI(route,body,headers,skipJSON);
        }else{
            throw new Error(json.error)
        }
    }
    
    return json as T
}

//Callback from login goes here and we can get the code
export const listenForAuth = async(PORT:number): Promise<string> => {
    return new Promise((resolve, reject) => {
        const server = createServer((req, res) => {
            if(!req.url){
                res.writeHead(404);
                res.end();
                server.close();
                reject("Failed to get login code. Please try again.");
                return
            }
            const code = req.url.split("?code=")[1] ?? null;
            if(!code){
                res.writeHead(404);
                res.end();
                server.close();
                reject("Failed to get login code. Please try again.");
                return
            }
            resolve(code);
            res.setHeader("Content-Type", "text/html");
            res.write("<!DOCTYPE html><html><body>Successfully logged in! You can close this window.</body><script>window.close()</script></html>");
            res.end();
            server.close();
        });
        server.listen(PORT);
        return new Promise((resolve, reject) => {
            server.on("listening", () => {
                resolve("http://localhost:" + PORT);
            });
        });
    })
}