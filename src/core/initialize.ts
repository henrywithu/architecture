import * as scroll from '../motion/scroll';
import * as hover from '../motion/hover';
import * as content from '../controllers/content';
import * as accordion from '../controllers/accordion';
import * as sliders from '../controllers/sliders';
import * as tabs from '../controllers/tabs';
import * as dialogs from '../controllers/dialogs';
import {initSoundToggle} from '../controllers/audio';
import {initForm} from '../controllers/form';
import {listen,cleanup} from './Lifecycle';
import {ScrollTriggerCore} from './runtime';
export function initScripts():void {
 [scroll.initThemeChange,scroll.initHeaderHide,initForm,scroll.initPlayPauseVideoScroll,content.initIndexCounter,content.initNextEntityCard,content.initOther,scroll.initAllParallax,scroll.initSectionTransition,scroll.initScrollElementsReveal,scroll.initHighlightText,hover.initMagneticEffect,hover.initMapPins,hover.initNavItemHover,hover.initMenuItemHover,scroll.initMarquee,initSoundToggle,accordion.initBenefitCard,accordion.initAccordion,accordion.initLoadMore,sliders.initSlider,sliders.initSliderText,sliders.initSliderFreemode,tabs.initTabs,tabs.initTabsHilight,tabs.initTabsText,tabs.initSummerWinterSwitcher,dialogs.initModalCta,dialogs.initModalMedia,dialogs.initModalMenu,hover.initFloatingTips,scroll.initScrollVideo,dialogs.initModalVimVideo].forEach(init=>init());
 let timer:ReturnType<typeof setTimeout>;
 listen(window,'resize',()=>{clearTimeout(timer);timer=setTimeout(()=>{ScrollTriggerCore.refresh(true);tabs.initTabsHilight();},40);});cleanup(()=>clearTimeout(timer));
}
