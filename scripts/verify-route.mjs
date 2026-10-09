import {chromium} from 'playwright';
const browser=await chromium.launch({executablePath:'/usr/bin/chromium',headless:true,args:['--no-sandbox','--disable-dev-shm-usage','--enable-unsafe-swiftshader']});
try{const page=await browser.newPage({viewport:{width:1280,height:800}});page.on('pageerror',e=>console.log(e.stack));await page.goto('http://localhost:5173/en');await page.waitForTimeout(11000);await page.locator('a[href="/en/news"]').first().evaluate(e=>e.click());await page.waitForTimeout(9000);console.log('url',page.url());}finally{await browser.close();}
