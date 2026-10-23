const fs=require('node:fs/promises');
const path=require('node:path');
const crypto=require('node:crypto');
try{process.loadEnvFile('.env.local');}catch{}
async function database(){const {neon}=await import('@neondatabase/serverless');const url=process.env.DATABASE_URL_POOLED||process.env.DATABASE_URL;if(!url)throw new Error('Database is not configured.');return neon(url);}
const root=path.resolve('.data/operations');
function key(){const value=process.env.BACKUP_ENCRYPTION_KEY||'';if(!/^[a-f0-9]{64}$/i.test(value))throw new Error('Set BACKUP_ENCRYPTION_KEY to a private 32-byte hex key.');return Buffer.from(value,'hex');}
function encrypt(value){const iv=crypto.randomBytes(12),cipher=crypto.createCipheriv('aes-256-gcm',key(),iv);const data=Buffer.concat([cipher.update(JSON.stringify(value),'utf8'),cipher.final()]);return Buffer.concat([Buffer.from('AVEX1'),iv,cipher.getAuthTag(),data]);}
function decrypt(value){if(value.subarray(0,5).toString()!=='AVEX1')throw new Error('Invalid backup format.');const decipher=crypto.createDecipheriv('aes-256-gcm',key(),value.subarray(5,17));decipher.setAuthTag(value.subarray(17,33));return JSON.parse(Buffer.concat([decipher.update(value.subarray(33)),decipher.final()]).toString());}
async function report(name,value){await fs.mkdir(root,{recursive:true});await fs.writeFile(path.join(root,name+'.json'),JSON.stringify({...value,at:new Date().toISOString()},null,2));}
module.exports={database,root,encrypt,decrypt,report};
