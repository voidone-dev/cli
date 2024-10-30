import { ArgsDef, CommandContext, defineCommand } from "citty";
import { consola } from "consola";
import { initApp } from "../lib/account.mjs";
import { createConfigFile, getConfig, getState } from "../lib/state.mjs";
import { stat, readdir, readFile } from "fs/promises";
import { join } from "path";
import { postAPI } from "../lib/api.mjs";
import mime from "mime-types";

export default defineCommand({
    meta: {
      name: "deploy",
      description: "Deploy your app to VoidOne",
    },
    async run({ args }) {
      consola.box("Void(1) Deploy")
      let state = getState();
      if(!state.session_token || !state.app_id){
          const reply = await consola.prompt(
            `No VoidOne app found. Would you like to initialize/link an app in this directory?`,
            {
              type: "confirm",
            })
          if(!reply) return;

          await initApp();
          this.run!({ args } as CommandContext<ArgsDef>);
          return;
      }

      const config = getConfig();
      if(!config.deployFolder){
        await createConfigFile();
        this.run!({ args } as CommandContext<ArgsDef>);
        return;
      }

      const appInfo = await postAPI<{ id: string, domain_name: string, name: string, status: string }>('/app/get',{
        id: state.app_id
      },{"Authorization": `Bearer ${state.session_token}`});

      //Update state in case of refresh
      state = getState();

      try{
        fetch(`https://${appInfo.domain_name}.voidone.dev`);
      }catch(e:any){}
      
      consola.start(`Scanning files...`);
      try{
        const stats = await stat(config.deployFolder);
        if(!stats.isDirectory()){
          throw new Error(`${config.deployFolder} is not a directory!`);
        }
      }catch(e:any){
        if(e.code === "ENOENT"){
          consola.error(`The folder ${config.deployFolder} does not exist!`);
          return;
        }
        consola.error(e);
        return;
      }


      //Recursively add files to a Queue, reject if file > 3mb
      const filesToDeploy:string[] = [];
      const dirQueue:string[] = [config.deployFolder!];

      while(dirQueue.length > 0){
        const dir = dirQueue.shift()!;
        const files = await readdir(dir);
        for(const file of files){
          const filePath = join(dir,file);
          const stats = await stat(filePath);
          if(stats.isDirectory()){
            dirQueue.push(filePath);
          }else{
            if(stats.size > 3_000_000){
              consola.error(`File ${filePath} is too large! Maximum size is currently 3MB.`);
              return;
            }
            filesToDeploy.push(filePath);
          }
        }
      }
      
      if(filesToDeploy.length === 0){
        consola.error("No files found to deploy!");
        return;
      }

      consola.success(`Found ${filesToDeploy.length} files.`);
      consola.start(`Deploying...`);

      try{
        const body = {
            id: state.app_id
        }

        await postAPI<{success:true}>('/app/deploy/prepare',body,{
          "Authorization": `Bearer ${state.session_token}`
        });

        const headers = {
          Authorization: `Bearer ${state.session_token}`
        }

        for(const filePath of filesToDeploy){
          const key = filePath.replaceAll("\\","/").split("/").slice(1).join("/");
          consola.info(`Uploading ${key}`);
          const formData = new FormData();
          const raw = await readFile(filePath);
          const res = mime.lookup(filePath);
          const blob = new Blob([raw],{type:res || "application/octet-stream"});
          formData.set("file",blob);
          formData.set("key",key); 
          formData.set("app-id",state.app_id!);
          await postAPI<{success:true}>("/app/deploy/add",formData,headers,true);
        }

        consola.info(`Optimizing Build...`);
        await postAPI<{success:true}>("/app/deploy/commit",body,headers);
        consola.success(`Deployed to https://${appInfo.domain_name}.voidone.dev`);
        console.log(`Manage deployment: https://voidone.dev/dashboard/app?id=${state.app_id}`);
      }catch(e:any){
        consola.error(`Deployment Failed! ${e}`);
        return;
      }
    }
})
      