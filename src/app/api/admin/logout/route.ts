import {getAuth} from '@/lib/admin-auth';
export async function POST(request:Request){
 const origin=request.headers.get('origin');
 const siteUrl=process.env.APP_URL||request.url;
 try{if(!origin||new URL(origin).origin!==new URL(siteUrl).origin)return new Response('Forbidden',{status:403});}catch{return new Response('Forbidden',{status:403});}
 await getAuth().signOut();
 return Response.redirect(new URL('/',siteUrl),303);
}
