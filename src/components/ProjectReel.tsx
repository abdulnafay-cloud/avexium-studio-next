import Link from 'next/link';
import Image from 'next/image';
import {projects} from '@/data/catalog';
export default function ProjectReel(){return <div className="project-reel" aria-label="Independent project previews"><div className="reel-track">{[...projects,...projects].map((p,i)=><Link href={`/work/${p.slug}`} className="reel-slide" key={`${p.slug}-${i}`} tabIndex={i>=projects.length?-1:undefined} aria-hidden={i>=projects.length?true:undefined}><Image src={p.image} alt={i<projects.length?`${p.title} — independent ${p.category} exploration`:''} fill sizes="(max-width:750px) 85vw, 55vw"/><span>{p.title} ↗</span></Link>)}</div></div>;}
