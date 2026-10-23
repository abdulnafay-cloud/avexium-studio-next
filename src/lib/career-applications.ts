import 'server-only';
import path from 'node:path';
import {mkdir,readFile,readdir,writeFile} from 'node:fs/promises';
import {authorizeOwner} from './admin-auth';
import {saveDatabaseApplication,listDatabaseApplications} from './career-database';

export type CareerApplication={id:string;createdAt:string;role:string;name:string;email:string;portfolio:string;message:string;availability:string;consentAt:string;hasCV:boolean};
export const applicationDirectory=()=>path.resolve(process.env.CAREERS_DATA_DIR||path.join(process.cwd(),'.data','career-applications'));
export async function saveApplication(application:CareerApplication,cv:Buffer|null){
 if(process.env.DATABASE_URL)return saveDatabaseApplication(application,cv);
 const root=applicationDirectory();await mkdir(root,{recursive:true,mode:0o700});
 // Each application gets a private directory; record.json is the commit marker.
 const directory=path.join(root,application.id);await mkdir(directory,{mode:0o700});
 if(cv)await writeFile(path.join(directory,'cv.pdf'),cv,{flag:'wx',mode:0o600});
 await writeFile(path.join(directory,'record.json'),JSON.stringify(application,null,2),{flag:'wx',mode:0o600});
}
export async function listApplications(){
 if(process.env.DATABASE_URL)return listDatabaseApplications();
 let folders:string[];try{folders=await readdir(applicationDirectory());}catch(error){if((error as NodeJS.ErrnoException).code==='ENOENT')return [];throw error;}
 const records=await Promise.all(folders.filter(id=>/^[a-f0-9-]{36}$/.test(id)).map(async id=>{try{return JSON.parse(await readFile(path.join(applicationDirectory(),id,'record.json'),'utf8')) as CareerApplication;}catch{return null;}}));
 return records.filter((record):record is CareerApplication=>record!==null).sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
}
export const authorizeApplications=authorizeOwner;
