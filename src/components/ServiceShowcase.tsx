export default function ServiceShowcase({title,slug,visual,labels}:{title:string;slug:string;visual:string;labels:string[]}){
 const website=slug==='website-design';
 return <aside className="service-showcase" aria-label={`${title} animated preview`}>
  <div className="showcase-orbit" aria-hidden="true"/>
  <div className="showcase-window">
   <div className="showcase-chrome"><span aria-hidden="true">● ● ●</span><span>{website?'Design in motion':title}</span><span aria-hidden="true">↗</span></div>
   {website?<div className="showcase-site" aria-hidden="true"><div className="showcase-site-nav"><b>FORM & FIELD</b><span>Studio&nbsp;&nbsp; Collection&nbsp;&nbsp; Contact</span></div><div className="showcase-site-hero"><span>Objects. Spaces. Stories.</span><strong>A considered<br/>digital presence.</strong><div className="showcase-sculpture"><i/><i/><i/></div><small>Explore the collection ↗</small></div><div className="showcase-site-cards"><div/><div/><div/></div><span className="showcase-cursor">↖<small>Explore</small></span></div>:<div className="showcase-specimen detail-scene open" dangerouslySetInnerHTML={{__html:visual}}/>}
  </div>
  <div className="showcase-labels" aria-hidden="true">{labels.slice(0,3).map((label,i)=><span key={label} style={{animationDelay:`${i*-1.7}s`}}>{label}</span>)}</div>
 </aside>;
}
