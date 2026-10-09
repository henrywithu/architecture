/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime, gsap } from '../core/runtime';
import { listen, manageObserver } from '../core/Lifecycle';

export function initSoundToggle(): any {
    function e(e?: any): any {
        const t: any = e.querySelector('[data-sound="list"]'), o: any = t ? Array.from(t.children) : [];
        if (!o.length)
            return;
        const n: any = e.classList.contains("is-playing");
        (gsap.killTweensOf(o),
            o.forEach((e?: any, t?: any): any => {
                const i: any = (o.length - 1) / 2, r: any = Math.abs(t - i), a: any = n ? 100 - 15 * r : 25, s: any = 0.6 * a, c: any = 0.5 * Math.random();
                gsap
                    .timeline()
                    .to(e, { scaleY: a / 100, duration: runtime.durM, ease: "ease" })
                    .to(e, {
                    scaleY: s / 100,
                    duration: 0.3 + 0.3 * Math.random(),
                    ease: "ease",
                    delay: c,
                    repeat: -1,
                    yoyo: !0,
                    repeatDelay: 0.2 * Math.random(),
                }, runtime.durM);
            }));
    }
    function t(): any {
        window.siteAudioActive ||
            ((n.volume = 0),
                n.play(),
                gsap.to(n, { volume: i, duration: runtime.durM }),
                (window.siteAudioActive = !0),
                o.forEach((t?: any): any => {
                    (t.classList.add("is-playing"), e(t));
                }));
    }
    const o: any = document.querySelectorAll("[data-sound-toggle]");
    if (!o.length)
        return;
    window.siteAudio ||
        ((window.siteAudio = new Audio("/assets/carpathian-whispers-hutsul-ambient.mp3")),
            (window.siteAudio.loop = !0),
            (window.siteAudio.volume = 0),
            (window.siteAudio.preload = "none"),
            (window.siteAudioVolume = 0.25),
            (window.siteAudioActive = !1),
            (window.siteAudioInitialized = !1));
    const n: any = window.siteAudio, i: any = window.siteAudioVolume;
    (o.forEach((t?: any): any => {
        (window.siteAudioActive && t.classList.add("is-playing"), e(t));
    }),
        o.forEach((i?: any): any => {
            listen(i, "click", (): any => {
                window.siteAudioActive
                    ? (gsap.to(n, {
                        volume: 0,
                        duration: runtime.durM,
                        onComplete: (): any => n.pause(),
                    }),
                        (window.siteAudioActive = !1),
                        o.forEach((t?: any): any => {
                            (t.classList.remove("is-playing"), e(t));
                        }))
                    : t();
            });
        }));
}
