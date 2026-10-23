try{process.loadEnvFile('.env.local');}catch{}
const failures=[];
for(const key of ['DATABASE_URL','NEON_AUTH_BASE_URL','NEON_AUTH_COOKIE_SECRET','ADMIN_OWNER_EMAIL','BACKUP_ENCRYPTION_KEY'])if(!process.env[key])failures.push(key+' is missing');
if(process.argv.includes('--production')){
 for(const key of ['PUBLIC_SITE_URL','RESEND_API_KEY','NOTIFICATION_FROM','NOTIFICATION_TO'])if(!process.env[key])failures.push(key+' is missing');
 try{const url=new URL(process.env.PUBLIC_SITE_URL);if(url.protocol!=='https:'||['localhost','127.0.0.1'].includes(url.hostname))throw new Error();if(new URL(process.env.APP_URL).origin!==url.origin)failures.push('APP_URL and PUBLIC_SITE_URL must match');}catch{failures.push('A real HTTPS production origin is required');}
}
if(failures.length){console.error(failures.join('\n'));process.exitCode=1;}else console.log('Required '+(process.argv.includes('--production')?'production':'local')+' configuration is present. Values were not printed.');
