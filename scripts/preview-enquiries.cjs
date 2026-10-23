// Synthetic visual preview only: no database, credentials or owner-session bypass.
const http=require('node:http');
const render=require('./check-enquiry-dashboard.cjs')();
const services=require('../src/data/service-pages.json');
const now=new Date().toISOString();
const fixtures=[{id:'synthetic-preview',createdAt:now,name:'Sample project contact',email:'sample@example.invalid',services:['Web development','Website design'],stage:'Starting something new',message:'Synthetic design preview only. A business website with a connected content management workflow, accessible navigation and a clear enquiry journey.',consentAt:now}];
http.createServer((request,response)=>{const url=new URL(request.url,'http://127.0.0.1:3007');const html=render(fixtures,services,'owner@example.invalid',{search:url.searchParams.get('q')||'',role:url.searchParams.get('role')||'all'}).replace('YOUR WORKSPACE, AT A GLANCE','DESIGN PREVIEW · SYNTHETIC SAMPLE DATA');response.writeHead(200,{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'});response.end(html);}).listen(3007,'127.0.0.1',()=>console.log('Synthetic enquiry dashboard: http://127.0.0.1:3007'));
