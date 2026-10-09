import {chromium} from 'playwright';import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const shader='src/rendering/shaders/halftone.vertex.glsl';const original=await fs.readFile(shader,'utf8');
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader']});const errors=[];
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.stack));await page.goto('http://localhost:5173/en');await page.waitForTimeout(10000);await page.evaluate(()=>window.__hmrMarker='kept');
 await fs.writeFile(shader,original+'\n// HMR verification probe\n');await page.waitForTimeout(8000);
 assert.equal(await page.evaluate(()=>window.__hmrMarker),'kept');assert.equal(await page.locator('#hero').count(),1);assert.equal(await page.locator('.noise').count(),1);assert.equal(await page.locator('.header').count(),1);
 await page.locator('[modal-menu-open]').first().click();await page.waitForTimeout(2000);assert(await page.locator('[modal-menu="menu"]').isVisible());await page.locator('[modal-menu-open]').first().click();await page.waitForTimeout(1500);assert(!(await page.locator('[modal-menu="menu"]').isVisible()));assert.deepEqual(errors,[]);
 const result={passed:true,checks:['Shader edit updates without document reload','Exactly one page/header/noise instance','Menu events remain functional after HMR'],errors};await fs.writeFile('research/hmr-verification.json',JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
}finally{await fs.writeFile(shader,original);await browser.close();}
