'use client';
import {useEffect,useState} from 'react';
export default function StudioClock(){const [time,setTime]=useState('PKT / UTC+5');useEffect(()=>{const update=()=>setTime(new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Karachi',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:true}).format(new Date()));update();const timer=setInterval(update,1000);return()=>clearInterval(timer);},[]);return <span className="studio-clock"><span>©2026</span><span>(UTC+5)</span><time suppressHydrationWarning>{time}</time></span>;}
