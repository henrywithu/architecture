import Lenis from 'lenis';
import {runtime,gsapCore,ScrollTriggerCore} from './runtime';
import {cleanup} from './Lifecycle';
export function initLenis():void {
 runtime.lenis?.destroy();
 const lenis=new Lenis({wrapper:window,duration:1.2,smoothWheel:true,touchMultiplier:2,easing:t=>Math.min(1,1.001-2**(-10*t)),infinite:false});runtime.lenis=lenis;
 const tick=(time:number)=>lenis.raf(time*1000);
 lenis.on('scroll',ScrollTriggerCore.update);gsapCore.ticker.add(tick);gsapCore.ticker.lagSmoothing(0);
 cleanup(()=>{gsapCore.ticker.remove(tick);lenis.destroy();runtime.lenis=null;});
 document.querySelectorAll<HTMLElement>('[data-lenis-scroll]').forEach(wrapper=>{
  const nested=new Lenis({wrapper,duration:0.6,smoothWheel:true,touchMultiplier:2,easing:t=>Math.min(1,1.001-2**(-10*t)),infinite:false});
  const tick=(time:number)=>nested.raf(time*1000);gsapCore.ticker.add(tick);cleanup(()=>{gsapCore.ticker.remove(tick);nested.destroy();});
 });
}
export function lockScroll():void {document.documentElement.style.setProperty('--scrollbar-width',`${innerWidth-document.documentElement.clientWidth}px`);document.body.style.paddingRight='var(--scrollbar-width)';document.documentElement.style.overflow='hidden';runtime.lenis?.stop();}
export function unlockScroll():void {document.documentElement.style.removeProperty('--scrollbar-width');document.body.style.paddingRight='';document.documentElement.style.overflow='';runtime.lenis?.start();}
