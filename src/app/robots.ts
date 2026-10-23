import type {MetadataRoute} from 'next';
import {isPublicSite,siteURL} from '@/lib/site-metadata';
export default function robots():MetadataRoute.Robots{return isPublicSite?{rules:{userAgent:'*',allow:'/',disallow:['/admin/','/api/']},sitemap:new URL('/sitemap.xml',siteURL).href}:{rules:{userAgent:'*',disallow:'/'}};}
