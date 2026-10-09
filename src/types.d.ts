import type { SplitText } from "gsap/SplitText";
declare global {
  interface Window {
    siteAudio?: HTMLAudioElement;
    siteAudioVolume?: number;
    siteAudioActive?: boolean;
    siteAudioInitialized?: boolean;
  }
  interface Element {
    _split?: SplitText;
  }
}
export {};
