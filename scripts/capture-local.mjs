import {chromium} from 'playwright';import fs from 'node:fs/promises';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
const errors=[];page.on('pageerror',e=>errors.push(e.stack));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await page.goto('http://localhost:5173/en',{waitUntil:'domcontentloaded'});await page.waitForTimeout(14000);await page.screenshot({path:'research/screenshots/local-desktop-top.png',timeout:60000});
console.log(JSON.stringify({errors,preloader:await page.locator('[data-preloader]').isVisible(),master:await page.locator('[data-master-preloader]').count(),text:(await page.locator('body').innerText()).slice(0,600)},null,2));await fs.writeFile('research/local-errors.json',JSON.stringify(errors,null,2));await browser.close();
