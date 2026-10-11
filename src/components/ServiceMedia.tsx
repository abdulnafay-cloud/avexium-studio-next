import Image from 'next/image';
import {projects} from '@/data/catalog';
const media:Record<string,number>={'digital-marketing':1,'seo-content':1,'brand-design':2,'ui-ux-design':0,'web-development':2,'mobile-development':0,ecommerce:1,'automation-ai':0,'cloud-devops':0,'3d-motion':2};
export default function ServiceMedia({slug}:{slug:string}){const p=projects[media[slug]??0];return <figure className="service-scope-media"><Image src={p.image} alt={`${p.title} — illustrative independent interface, not a service outcome or commissioned client work`} fill sizes="95vw"/><figcaption>ILLUSTRATIVE INDEPENDENT WORK / {p.title.toUpperCase()}</figcaption></figure>;}
