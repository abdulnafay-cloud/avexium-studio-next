const assert=require('node:assert/strict');
const {encrypt,decrypt}=require('./ops-common.cjs');
const fixture={version:1,applications:[{id:'synthetic',cv:'255044462d'}],enquiries:[],outbox:[]};
const encrypted=encrypt(fixture);assert.deepEqual(decrypt(encrypted),fixture);assert.ok(!encrypted.includes(Buffer.from('synthetic')));
const damaged=Buffer.from(encrypted);damaged[damaged.length-1]^=1;assert.throws(()=>decrypt(damaged));
console.log('Passed: encrypted backup round trip, concealed record data and tamper rejection.');
