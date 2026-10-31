const puppeteer=require('puppeteer-core');
const FPS=parseInt(process.env.FPS||'24');
const TL=JSON.parse(process.env.TL_JSON);
const DUR=TL.dur;
const START=parseInt(process.env.START||'0'), END=parseInt(process.env.END||String(Math.round(DUR*FPS)));
(async()=>{
  const browser=await puppeteer.launch({executablePath:'/usr/bin/google-chrome',headless:'new',
    args:['--no-sandbox','--disable-frame-rate-limit','--hide-scrollbars','--force-device-scale-factor=1','--allow-file-access-from-files']});
  const page=await browser.newPage();
  await page.setViewport({width:1280,height:720});
  await page.goto('file:///tmp/vid2/'+(process.env.PAGE||'overlay.html'));
  await page.waitForFunction('window.__ready===true',{timeout:15000});
  await page.evaluate((tl)=>window.__setTL(tl),TL);
  for(let i=START;i<END;i++){
    await page.evaluate((tt)=>window.__renderAtTime(tt),i/FPS);
    await page.screenshot({path:`/tmp/vid2/ov/f${String(i).padStart(4,'0')}.png`,omitBackground:true});
  }
  await browser.close();
  console.log('chunk done',START,END);
})().catch(e=>{console.error(e);process.exit(1)});
