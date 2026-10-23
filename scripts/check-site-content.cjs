const fs=require('node:fs');
const assert=require('node:assert/strict');
const markup=JSON.parse(fs.readFileSync('src/data/reference-markup.ts','utf8').match(/referenceMarkup=(.*);/)[1]);
for(const route of ['home','services','work','process','careers','start']){
 const page=markup.match(new RegExp(`<main class="page(?: on)?" data-r="${route}">[\\s\\S]*?<\\/main>`))?.[0];
 assert.ok(page,'Missing page '+route);
 assert.equal((page.match(/<h1[ >]/g)||[]).length,1,'One primary heading required on '+route);
 assert.ok(!/\bWeeks?\s+\d|Open roles|small, senior|next spark|pixel-perfect|Design\. Build\. Grow\./i.test(page),'Unreviewed copy on '+route);
}
for(const id of ['svc','work','logo','hproc','hcta','words','plist','stmt','track','sx','deck','need','bud','fn','fe','fmsg','fm','st','enquiry-consent','edit-brief'])assert.ok(markup.includes(`id="${id}"`),'Runtime hook removed: '+id);
assert.ok(markup.includes('From idea to launch.'));
assert.equal((markup.match(/class="section-intro"/g)||[]).length,3);
assert.ok(markup.includes('id="career-search-title"'));
assert.ok(markup.includes('Your enquiry is submitted directly'));
assert.equal((markup.match(/class="form-field"/g)||[]).length,3);
assert.ok(markup.includes('aria-label="Project overview"'),'Message field must match its visible label');
const runtime=fs.readFileSync('public/reference/runtime.js','utf8');
assert.ok(runtime.includes('var names2=["Brand identity","Website design"'),'Marquee should describe capabilities, not imply client logos');
assert.ok(fs.readFileSync('src/app/layout.tsx','utf8').includes("import './editorial.css'"));
console.log('Passed: six content pages, clear headings, honest project and collaboration copy, labelled enquiry fields and preserved animation hooks.');
