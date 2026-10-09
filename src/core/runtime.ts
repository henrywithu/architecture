import {gsap as gsapCore} from 'gsap';
import {ScrollTrigger as ScrollTriggerCore} from 'gsap/ScrollTrigger';
import {CustomEase} from 'gsap/CustomEase';
import {SplitText as SplitTextCore} from 'gsap/SplitText';
import {Flip as FlipCore} from 'gsap/Flip';
import SwiperCore from 'swiper/bundle';
import type Lenis from 'lenis';
import type {SceneManager} from './scenes';
gsapCore.registerPlugin(ScrollTriggerCore,CustomEase,SplitTextCore,FlipCore);
CustomEase.create('InOut','0.76,0,0.24,1');CustomEase.create('Out','0.25,1,0.5,1');
CustomEase.create('In','0.5,0,0.75,0');CustomEase.create('Ease','0.25,0.1,0.25,1');CustomEase.create('Write','0.333,0,0.667,1');
export {gsapCore,ScrollTriggerCore};
// The original data-attribute protocol accepts heterogeneous DOM targets.
export const gsap: typeof gsapCore & {utils:any} = gsapCore;
export const ScrollTrigger=ScrollTriggerCore;
export const SplitText=SplitTextCore;
export const Flip=FlipCore;
export const Swiper=SwiperCore;
export const runtime:{lenis:Lenis|null;breakPoint:number;globalSceneManager:SceneManager|null;durS:number;durM:number;durL:number;stagger:number;delayReveal:number;framesPromise:Promise<HTMLImageElement[]>}={
  lenis:null,breakPoint:992,globalSceneManager:null,durS:0.4,durM:0.8,durL:1.2,stagger:0.1,delayReveal:0.2,framesPromise:Promise.resolve([])
};
export function loadHeroFrames():void {
  runtime.framesPromise=innerWidth>=runtime.breakPoint?Promise.all(Array.from({length:120},(_,i)=>new Promise<HTMLImageElement|null>(resolve=>{
    const image=new Image();image.decoding='async';image.onload=()=>resolve(image);image.onerror=()=>resolve(null);image.src=`/assets/hero-video-new/${String(i).padStart(3,'0')}.webp`;
  }))).then(images=>images.filter((image):image is HTMLImageElement=>image!==null)):Promise.resolve([]);
}
