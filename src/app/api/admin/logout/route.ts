import {getAuth} from '@/lib/admin-auth';
export async function POST(request:Request){
 const origin=request.headers.get('origin');
 try{if(!origin||new URL(origin).host!==request.headers.get('host'))return new Response('Forbidden',{status:403});}catch{return new Response('Forbidden',{status:403});}
 await getAuth().signOut();
 return Response.redirect(new URL('/admin/login',request.url),303);
}
