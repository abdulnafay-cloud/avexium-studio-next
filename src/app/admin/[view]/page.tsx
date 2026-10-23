import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import AdminAuthForm from '@/components/AdminAuthForm';
import '../admin-auth.css';

export const dynamic='force-dynamic';
export const metadata:Metadata={title:'Owner access — Avexium Digital',robots:{index:false,follow:false}};
const views:Record<string,{eyebrow:string;title:string;copy:string}>={
 login:{eyebrow:'Private workspace',title:'Welcome back.',copy:'Sign in to review applications and the people behind the work.'},
 signup:{eyebrow:'Owner account',title:'Your workspace starts here.',copy:'Create your owner account with the approved email address. Verify it before accessing applications.'},
 forgot:{eyebrow:'Account recovery',title:'Let’s get you back in.',copy:'Enter your owner email and we’ll send a secure password reset link.'},
 reset:{eyebrow:'Account recovery',title:'A fresh start.',copy:'Choose a new password for your owner account.'},
 verify:{eyebrow:'Verify your account',title:'Confirm it’s you.',copy:'Request a code for your owner email, then enter it below. Check your Spam folder if it does not arrive.'}
};
export default async function AdminAuthPage({params,searchParams}:{params:Promise<{view:string}>;searchParams:Promise<{token?:string}>}){
 const {view}=await params,details=views[view];if(!details)notFound();
 const {token}=await searchParams;
 return <main className="admin-access"><header><Link className="admin-access-brand" href="/">AVEXIUM</Link><Link href="/">Back to website ↗</Link></header><div className="admin-access-layout"><section className="admin-access-story"><span>AVEXIUM DIGITAL / OWNER ACCESS</span><h2>A space for<br/>what comes <em>next.</em></h2><p>Discover new perspectives.<br/>Review portfolios. Build the right team.</p><div className="admin-access-orbit" aria-hidden="true"><i/><i/><i/><b/></div></section><section className="admin-access-card"><p className="admin-access-eyebrow">{details.eyebrow}</p><h1>{details.title}</h1><p>{details.copy}</p><AdminAuthForm view={view} token={typeof token==='string'?token:''}/><div className="admin-access-private">Restricted to the verified owner account.</div></section></div><footer>Avexium Digital · Private applications workspace</footer></main>;
}
