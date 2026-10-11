import type {Metadata} from 'next';
import Link from 'next/link';
import Navigation from '@/components/Navigation';
import MotionRuntime from '@/components/MotionRuntime';
import MotionControl from '@/components/MotionControl';
import SiteStatus from '@/components/SiteStatus';
import {projects} from '@/data/catalog';
import './globals.css';
import './motion-revision.css';
export const metadata:Metadata={title:{default:'Avexium — Design, code & connected systems',template:'%s — Avexium Digital'},description:'An independent digital agency connecting brand, web experiences and practical business systems.'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en"><body id="top"><a className="skip" href="#main">Skip to content</a><Navigation/><MotionRuntime/><MotionControl/><SiteStatus/><main id="main">{children}</main><footer>
 <div className="footer-opening"><Link className="footer-title" href="/contact"><span data-reveal>GET IN TOUCH.</span></Link><p>Avexium is an independent digital practice connecting identity, web experiences and operational systems. Clear design, purposeful motion and practical engineering.</p></div>
 <div className="footer-grid"><div><small>START A CONVERSATION</small><Link href="/contact">Tell us about your project ↗</Link><Link href="/studio">Meet the studio ↗</Link></div><div><small>NAVIGATION</small>{[['Studio','/studio'],['Work','/work'],['Services','/services'],['Process','/process'],['Journal','/journal'],['Industries','/industries']].map(([t,u])=><Link key={u} href={u}>{t}</Link>)}</div><div><small>INDEPENDENT WORK</small>{projects.map(p=><Link key={p.slug} href={`/work/${p.slug}`}>{p.title}</Link>)}</div><div><small>CONTACT</small><a href="mailto:avexiumdigital@gmail.com">avexiumdigital@gmail.com</a><small style={{marginTop:35}}>INFORMATION</small><Link href="/privacy">Preview privacy</Link><Link href="/site-information">Site information</Link></div></div>
 <Link href="/" className="footer-wordmark" aria-label="Avexium home">avexium<span>digital studio</span></Link><div className="footer-bottom"><span>©2026 Avexium Digital</span><span>Original work. No invented client results.</span><a href="#top">BACK TO TOP ↑</a></div></footer></body></html>;}
