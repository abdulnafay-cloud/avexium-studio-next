import services from '@/data/service-pages.json';
import {saveEnquiry} from '@/lib/enquiries';
import {operationalEvent} from '@/lib/operations';
export const runtime='nodejs';
const attempts=new Map<string,{count:number;expires:number}>();
const fail=(error:string,status:number)=>Response.json({error},{status,headers:{'Cache-Control':'no-store'}});
export async function POST(request:Request){
 try{if(new URL(request.headers.get('origin')||'').host!==request.headers.get('host'))return fail('Submit your enquiry from this website.',403);}catch{return fail('Submit your enquiry from this website.',403);}
 if(!request.headers.get('content-type')?.startsWith('application/json'))return fail('Use the project enquiry form.',415);
 let body:Record<string,unknown>;
 try{const reader=request.body?.getReader();if(!reader)return fail('Your enquiry was empty.',400);const chunks:Uint8Array[]=[];let size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>20000){await reader.cancel();return fail('Your project brief is too long.',413);}chunks.push(value);}body=JSON.parse(Buffer.concat(chunks).toString());if(!body||typeof body!=='object'||Array.isArray(body))throw Error();}catch{return fail('Your enquiry could not be read.',400);}
 const text=(key:string)=>typeof body[key]==='string'?(body[key] as string).trim():'';
 const id=text('idempotencyKey'),name=text('name'),email=text('email').toLowerCase(),message=text('message'),stage=text('stage')||'Exploring options';
 if(text('website'))return fail('Unable to submit this enquiry.',400);
 if(!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(id))return fail('Refresh the form and try again.',400);
 if(name.length<2||name.length>120||email.length>254||!/^\S+@[^\s@]+\.[^\s@]+$/.test(email))return fail('Enter your full name and a valid email address.',400);
 if(message.length<30||message.length>6000||stage.length>100)return fail('Describe your project in 30–6,000 characters.',400);
 if(body.consent!==true)return fail('Please agree to the privacy information.',400);
 if(!Array.isArray(body.services)||body.services.length>10)return fail('Choose valid services.',400);
 const selected=[...new Set(body.services.map(value=>services.find(service=>service.slug===value||service.title===value)?.title))];
 if(selected.some(value=>!value))return fail('Choose valid services.',400);
 const now=Date.now();for(const [key,value] of attempts)if(value.expires<now)attempts.delete(key);
 const prior=attempts.get(email);if(prior&&prior.count>=5)return fail('You have submitted several enquiries. Please try again in an hour.',429);
 if(Array.from(attempts.values()).reduce((sum,item)=>sum+item.count,0)>=100)return fail('The enquiry form is busy. Please try again later.',429);
 attempts.set(email,{count:(prior?.count||0)+1,expires:prior?.expires||now+3600000});
 const createdAt=new Date().toISOString();
 try{await saveEnquiry({id,createdAt,name,email,services:selected as string[],stage,message,consentAt:createdAt});}
 catch{await operationalEvent('enquiry.storage_failed');return fail('Your enquiry could not be saved. Please try again or email avexiumdigital@gmail.com.',503);}
 return Response.json({reference:id},{status:201,headers:{'Cache-Control':'no-store'}});
}
