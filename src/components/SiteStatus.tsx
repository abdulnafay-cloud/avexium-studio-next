'use client';
import {usePathname} from 'next/navigation';
import StudioClock from './StudioClock';
export default function SiteStatus(){const path=usePathname();return path==='/'?<div className="site-status"><StudioClock/></div>:null;}
