const puppeteer=require('puppeteer-core');
(async()=>{
  const times=process.env.STILLS.split(',').map(Number);
  const browser=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',
    args:['--no-sandbox','--hide-scrollbars','--force-device-scale-factor=1','--allow-file-access-from-files']});
  const page=await browser.newPage();
  await page.setViewport({width:1280,height:720});
  await page.goto('file:///tmp/vid2/overlay.html');
  await page.waitForFunction('window.__ready===true',{timeout:15000});
  await page.evaluate(()=>window.__setTL({dur:187.587}));
  for(const t of times){
    await page.evaluate((tt)=>window.__renderAtTime(tt),t);
    await page.screenshot({path:`/tmp/vid2/chk/t${t}.png`,omitBackground:true});
  }
  await browser.close();console.log('stills done');
})().catch(e=>{console.error(e);process.exit(1)});
