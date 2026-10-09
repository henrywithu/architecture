/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime, gsap, ScrollTrigger } from "../core/runtime";
import {
  listen,
  manageObserver,
  managedInterval,
  managedTimeout,
  matchMedia,
} from "../core/Lifecycle";
import { animateTextH, animateTextP, animateLine } from "../motion/text";
export function initBenefitCard(): any {
  document.querySelectorAll("[hover-benefit-card]").forEach((e?: any): any => {
    function t(): any {
      (gsap.set(e, { zIndex: 16 }),
        i.classList.add("is-open", "theme_on-dark"),
        gsap.fromTo(
          n,
          { display: "block", clipPath: "inset(0% 0% 100% 0%)", scale: 1.1 },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            duration: runtime.durL,
            ease: "Out",
            overwrite: !0,
          },
        ),
        gsap.to(r, {
          rotate: 90,
          duration: runtime.durS,
          ease: "InOut",
          overwrite: !0,
        }),
        animateTextH(a, "reveal"),
        animateTextP(s, "reveal"),
        animateLine(c, "reveal"));
    }
    function o(): any {
      (gsap.set(e, { zIndex: "" }),
        i.classList.remove("is-open", "theme_on-dark"),
        gsap.to(n, {
          clipPath: "inset(100% 0% 0% 0%)",
          scale: 0.75,
          duration: runtime.durM,
          delay: runtime.delayReveal,
          ease: "InOut",
          onComplete: (): any => gsap.set(n, { display: "none" }),
          overwrite: !0,
        }),
        gsap.to(r, {
          rotate: 0,
          duration: runtime.durS,
          ease: "InOut",
          overwrite: !0,
        }),
        animateTextH(a, "hide"),
        animateTextP(s, "hide"),
        animateLine(c, "hide"));
    }
    const n: any = e.querySelector("[hover='info']"),
      i: any = e.querySelector("[hover='name']"),
      r: any = e.querySelector("[hover='ico-ver']"),
      a: any = e.querySelectorAll("[hover='h']"),
      s: any = e.querySelectorAll("[hover='p']"),
      c: any = e.querySelectorAll("[hover='line']");
    let l: any = !1;
    (gsap.set(n, { display: "none" }),
      listen(e, "click", (): any => {
        l ? (o(), (l = !1)) : (t(), (l = !0));
      }));
  });
}
export function initAccordion(): any {
  let e: any = null;
  document.querySelectorAll("[accordion-btn]").forEach((t?: any): any => {
    function o(): any {
      (gsap.to(r, {
        height: "auto",
        duration: runtime.durL,
        ease: "Out",
        onComplete: (): any => {
          ScrollTrigger.refresh();
        },
      }),
        gsap.fromTo(
          a,
          { rotate: 0 },
          { rotate: 90, duration: runtime.durM, ease: "InOut", overwrite: !0 },
        ),
        animateTextP(s, "reveal"));
    }
    function n(): any {
      (gsap.to(r, {
        height: 0,
        duration: runtime.durL,
        ease: "Out",
        onComplete: (): any => {
          ScrollTrigger.refresh();
        },
        overwrite: !0,
      }),
        gsap.to(a, {
          rotate: 180,
          duration: runtime.durM,
          ease: "InOut",
          overwrite: !0,
        }),
        animateTextP(s, "hide"));
    }
    const i: any = t.getAttribute("accordion-btn"),
      r: any = document.querySelector(`[accordion-desc="${i}"]`),
      a: any = document.querySelector(`[accordion-icon-ver="${i}"]`),
      s: any = document.querySelectorAll(`[accordion-paragraph="${i}"]`);
    r &&
      (gsap.set(r, { height: 0, overflow: "hidden" }),
      listen(t, "click", (): any => {
        (e && e !== t && e.closeFunc(),
          e !== t ? (o(), (e = t)) : (n(), (e = null)));
      }),
      (t.closeFunc = n));
  });
}
export function initLoadMore(): any {
  const e: any = document.querySelectorAll("[data-load-more]");
  e.length &&
    e.forEach((e?: any): any => {
      function t(): any {
        ((d = Array.from(s.children)),
          d.forEach((e?: any, t?: any): any => {
            t >= c && (e.style.display = "none");
          }),
          (l = c),
          n(),
          ScrollTrigger.refresh());
      }
      function o(): any {
        (d.slice(l, l + c).forEach((e?: any): any => {
          ((e.style.display = ""),
            gsap.fromTo(
              e,
              { opacity: 0, yPercent: 15 },
              { opacity: 1, yPercent: 0, duration: runtime.durM, ease: "Out" },
            ),
            ScrollTrigger.refresh());
        }),
          (l += c),
          n());
      }
      function n(): any {
        l >= d.length && (a.style.display = "none");
      }
      const i: any = e.getAttribute("device"),
        r: any = window.innerWidth >= runtime.breakPoint;
      if ("desk" === i && !r) return;
      if ("mob" === i && r) return;
      const a: any = e.querySelector('[data-load-more="btn"]'),
        s: any = e.querySelector('[data-load-more="list"]');
      if (!a || !s) return;
      const c: any = 4;
      let l: any = 0,
        d: any = [];
      (listen(a, "click", o), t());
    });
}
