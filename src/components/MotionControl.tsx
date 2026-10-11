'use client';
import {useState} from 'react';
export default function MotionControl(){const [paused,setPaused]=useState(false);return <button className="motion-control" aria-pressed={paused} onClick={()=>{const next=!paused;setPaused(next);document.documentElement.dataset.motion=next?'pause':'play';window.dispatchEvent(new Event('avexium-motion-change'));}}>{paused?'Play motion':'Pause motion'} <span aria-hidden="true">{paused?'▷':'Ⅱ'}</span></button>;}
