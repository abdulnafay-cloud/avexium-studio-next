import path from 'node:path';
import {readFile} from 'node:fs/promises';
import {applicationDirectory,authorizeApplications} from '@/lib/career-applications';
import {readDatabaseCV} from '@/lib/career-database';

export const runtime='nodejs';
export async function GET(request:Request,{params}:{params:Promise<{id:string}>}){
 const denied=await authorizeApplications();if(denied)return denied;
 const {id}=await params;if(!/^[a-f0-9-]{36}$/.test(id))return new Response('Not found',{status:404});
 try{
  if(!process.env.DATABASE_URL)await readFile(path.join(applicationDirectory(),id,'record.json'));
  const file=process.env.DATABASE_URL?await readDatabaseCV(id):await readFile(path.join(applicationDirectory(),id,'cv.pdf'));
  if(!file)return new Response('Not found',{status:404});
  return new Response(file,{headers:{'Content-Type':'application/pdf','Content-Disposition':`attachment; filename="application-${id}.pdf"`,'Cache-Control':'private, no-store','X-Content-Type-Options':'nosniff','X-Robots-Tag':'noindex'}});
 }catch{return new Response('Not found',{status:404});}
}
