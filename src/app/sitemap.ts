import type {MetadataRoute} from 'next';
import {siteURL,isPublicSite,publicPages} from '@/lib/site-metadata';
import services from '@/data/service-pages.json';
import roles from '@/data/career-roles.json';
import {projects} from '@/data/catalog';
export default function sitemap():MetadataRoute.Sitemap{if(!isPublicSite)return [];return [...Object.keys(publicPages).map(p=>p==='home'?'/':'/'+p),...services.map(p=>'/services/'+p.slug),...roles.map(p=>'/careers/'+p.slug),...projects.map(p=>'/work/'+p.slug),'/about','/privacy','/site-information'].map(path=>({url:new URL(path,siteURL).href}));}
