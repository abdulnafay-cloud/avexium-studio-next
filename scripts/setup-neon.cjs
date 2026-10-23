const fs=require('node:fs/promises');
const path=require('node:path');
process.loadEnvFile('.env.local');
async function main(){
 const {neon}=await import('@neondatabase/serverless');
 const sql=neon(process.env.DATABASE_URL_POOLED||process.env.DATABASE_URL);
 const schema=(await fs.readFile('scripts/sql/career-applications.sql','utf8'))+'\n'+(await fs.readFile('scripts/sql/operations.sql','utf8'));
 for(const statement of schema.split(';').map(value=>value.trim()).filter(Boolean))await sql.query(statement);
 console.log('Connected to Neon. Private application table and access restrictions are ready.');
 const root=path.resolve(process.env.CAREERS_DATA_DIR||'.data/career-applications');
 let folders=[];try{folders=await fs.readdir(root);}catch(error){if(error.code!=='ENOENT')throw error;}
 let migrated=0;
 for(const id of folders.filter(id=>/^[a-f0-9-]{36}$/.test(id))){
  const record=JSON.parse(await fs.readFile(path.join(root,id,'record.json'),'utf8'));
  if(record.id!==id)throw new Error('Application reference mismatch.');
  const cv=record.hasCV?await fs.readFile(path.join(root,id,'cv.pdf')):null;
  await sql`INSERT INTO public.avexium_career_applications(id,created_at,record,cv) VALUES (${id},${record.createdAt},${JSON.stringify(record)}::jsonb,decode(${cv?.toString('hex')||null},'hex')) ON CONFLICT (id) DO NOTHING`;
  migrated++;
 }
 console.log('Local records checked and copied to Neon: '+migrated+'. Existing local files were retained.');
 const response=await fetch(process.env.NEON_AUTH_BASE_URL+'/get-session',{signal:AbortSignal.timeout(15000)});
 console.log('Neon Auth reachability: HTTP '+response.status+'.');
 if(!response.ok)process.exitCode=1;
}
main().catch(()=>{console.error('Neon setup failed. Check the private environment values, network access and database permissions. No credentials were printed.');process.exitCode=1;});
