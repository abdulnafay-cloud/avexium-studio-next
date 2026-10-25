import type {Metadata} from 'next';
import {siteURL,isPublicSite} from '@/lib/site-metadata';
import './reference.css';
import './editorial.css';
import './studio-theme.css';
export const metadata:Metadata={metadataBase:siteURL,title:'Avexium Digital',description:'Website design, brand identity and software development for restaurants, retailers and service businesses.',robots:isPublicSite?{index:true,follow:true}:{index:false,follow:false},icons:{icon:'/icon.svg'},openGraph:{siteName:'Avexium Digital',images:['/opengraph-image']},twitter:{card:'summary_large_image',images:['/opengraph-image']}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>;}
