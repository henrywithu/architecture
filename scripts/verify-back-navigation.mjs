import {chromium} from 'playwright';import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader']});const errors=[];
try{
 const page=await browser.newPage({viewport:{width:390,height:844}});page.on('pageerror',e=>errors.push(e.stack));await page.goto('http://localhost:5173/en',{waitUntil:'domcontentloaded'});await page.waitForTimeout(11000);
 await page.evaluate(()=>scrollTo(0,1400));await page.waitForTimeout(1000);const saved=await page.evaluate(()=>scrollY);
 await page.locator('a[href="/en/news"]').first().evaluate(e=>e.click());await page.waitForURL('**/en/news');await page.waitForTimeout(5500);await page.goBack({waitUntil:'domcontentloaded'});await page.waitForTimeout(6500);
 assert.equal(new URL(page.url()).pathname,'/en');assert(Math.abs((await page.evaluate(()=>scrollY))-saved)<5);assert.equal(await page.locator('#hero').count(),1);assert.deepEqual(errors,[]);
 const result={passed:true,savedScroll:saved,restoredScroll:await page.evaluate(()=>scrollY),errors};await fs.writeFile('research/back-navigation-verification.json',JSON.stringify(result,null,2));console.log(result);
}finally{await browser.close();}
