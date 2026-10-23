import type {Metadata} from 'next';
import {siteURL,isPublicSite} from '@/lib/site-metadata';
import './reference.css';
import './editorial.css';
export const metadata:Metadata={metadataBase:siteURL,title:'Avexium Digital',description:'Brand identities, websites and software built around your business.',robots:isPublicSite?{index:true,follow:true}:{index:false,follow:false},icons:{icon:'/icon.svg'},openGraph:{siteName:'Avexium Digital',images:['/opengraph-image']},twitter:{card:'summary_large_image',images:['/opengraph-image']}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
