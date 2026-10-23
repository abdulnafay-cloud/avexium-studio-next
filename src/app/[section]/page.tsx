import {notFound} from 'next/navigation';
import ReferencePage from '@/components/ReferencePage';
import {pageMetadata,publicPages,type PublicSection} from '@/lib/site-metadata';
export const dynamicParams=false;
export function generateStaticParams(){return Object.keys(publicPages).filter(section=>section!=='home').map(section=>({section}));}
export async function generateMetadata({params}:{params:Promise<{section:string}>}){const {section}=await params;if(!(Object.hasOwn(publicPages,section)))return {};const [title,description]=publicPages[section as PublicSection];return pageMetadata('/'+section,title,description);}
export default async function Overview({params}:{params:Promise<{section:string}>}){const {section}=await params;if(!(Object.hasOwn(publicPages,section))||section==='home')notFound();return <ReferencePage section={section as PublicSection}/>;}
