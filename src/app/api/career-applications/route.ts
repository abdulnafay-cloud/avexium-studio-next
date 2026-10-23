import {operationalEvent} from '@/lib/operations';
import {randomUUID} from 'node:crypto';
import roles from '@/data/career-roles.json';
import {saveApplication} from '@/lib/career-applications';

export const runtime='nodejs';
const maxBody=3*1024*1024+32*1024;
const attempts=new Map<string,{count:number;reset:number}>();
const reply=(error:string,status:number)=>Response.json({error},{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:Request){
 const origin=request.headers.get('origin');
 try{if(!origin||new URL(origin).host!==request.headers.get('host'))return reply('Please submit the application from this website.',403);}catch{return reply('Please submit the application from this website.',403);}
 if(!request.headers.get('content-type')?.startsWith('multipart/form-data'))return reply('Please use the application form.',415);
 if(Number(request.headers.get('content-length')||0)>maxBody)return reply('Please choose a PDF smaller than 3 MB.',413);
 let data:FormData;
 try{
  const reader=request.body?.getReader();if(!reader)return reply('The application was empty.',400);
  const chunks:Uint8Array[]=[];let size=0;
  while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>maxBody){await reader.cancel();return reply('Please choose a PDF smaller than 3 MB.',413);}chunks.push(value);}
  data=await new Request(request.url,{method:'POST',headers:{'Content-Type':request.headers.get('content-type')!},body:Buffer.concat(chunks)}).formData();
 }catch{return reply('We could not read your application. Please try again.',400);}
 const text=(name:string)=>typeof data.get(name)==='string'?(data.get(name) as string).trim():'';
 if(text('website'))return reply('Unable to submit this application.',400);
 const role=text('role'),name=text('name'),email=text('email').toLowerCase(),portfolio=text('portfolio'),message=text('message'),availability=text('availability');
 if(!roles.some(item=>item.slug===role))return reply('Please select a valid role.',400);
 if(name.length<2||name.length>100||email.length>254||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email))return reply('Enter your full name and a valid email address.',400);
 try{const url=new URL(portfolio);if(!['http:','https:'].includes(url.protocol)||portfolio.length>1500)throw new Error();}catch{return reply('Enter a full portfolio URL starting with https:// or http://.',400);}
 if(message.length<30||message.length>5000||availability.length>200)return reply('Tell us about your work in 30–5,000 characters. Keep availability under 200 characters.',400);
 if(text('consent')!=='yes')return reply('Please agree to the application privacy information.',400);
 const upload=data.get('cv');let cv:Buffer|null=null;
 if(upload instanceof File&&upload.size){
  if(upload.size>3*1024*1024)return reply('Please choose a PDF smaller than 3 MB.',413);
  cv=Buffer.from(await upload.arrayBuffer());
  if(!upload.name.toLowerCase().endsWith('.pdf')||cv.subarray(0,5).toString()!=='%PDF-')return reply('Your CV must be a PDF file.',400);
 }
 const now=Date.now();for(const [key,value] of attempts)if(value.reset<now)attempts.delete(key);
 const previous=attempts.get(email);if(previous&&previous.count>=3)return reply('You have already submitted several applications. Please try again in an hour.',429);
 if(Array.from(attempts.values()).reduce((sum,entry)=>sum+entry.count,0)>=100)return reply('Applications are busy right now. Please try again later.',429);
 if(attempts.size>=10000&&!previous)return reply('Applications are busy right now. Please try again shortly.',429);
 attempts.set(email,{count:(previous?.count||0)+1,reset:previous?.reset||now+3600000});
 const id=randomUUID(),createdAt=new Date().toISOString();
 try{await saveApplication({id,createdAt,role,name,email,portfolio,message,availability,consentAt:createdAt,hasCV:!!cv},cv);}
 catch{await operationalEvent('career_application_storage_failed');return reply('Your application could not be saved. Please try again or contact avexiumdigital@gmail.com.',503);}
 return Response.json({reference:id},{status:201,headers:{'Cache-Control':'no-store'}});
}
