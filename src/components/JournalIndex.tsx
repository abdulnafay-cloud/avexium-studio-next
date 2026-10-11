'use client';
import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {articles} from '@/data/editorial';
export default function JournalIndex(){const [topic,setTopic]=useState('All');const shown=articles.filter(a=>topic==='All'||a.topic===topic);return <><div className="journal-filters" role="group" aria-label="Filter practice notes">{['All',...articles.map(a=>a.topic)].map(t=><button key={t} aria-pressed={t===topic} onClick={()=>setTopic(t)}>{t}</button>)}</div><p className="sr-only" role="status">{shown.length} practice {shown.length===1?'note':'notes'}</p><div className="journal-grid">{shown.map(a=><Link href={`/journal/${a.slug}`} className="journal-card" key={a.slug}><div className="work-media"><Image src={a.image} alt="Independent Avexium project illustrating this practice note" fill sizes="(max-width:750px) 90vw, 30vw"/></div><small>{a.topic.toUpperCase()} / PRACTICE NOTE</small><h2>{a.title}</h2><p>{a.intro}</p><span className="journal-read">Read the note ↗</span></Link>)}</div></>;}
