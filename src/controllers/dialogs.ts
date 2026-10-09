/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime, gsap } from "../core/runtime";
import {
  listen,
  manageObserver,
  managedInterval,
  managedTimeout,
  matchMedia,
} from "../core/Lifecycle";
import { animateTextH, animateCtn, animateLine } from "../motion/text";
import { lockScroll, unlockScroll } from "../core/scroll";
export function initModalCta(): any {
  document.querySelectorAll("[modal-cta-open]").forEach((e?: any): any => {
    function t(): any {
      (gsap.set([i, a], { display: "block" }),
        gsap.fromTo(
          r,
          { scale: 0, rotateX: -90, yPercent: -100, rotate: -25 },
          {
            scale: 1,
            rotateX: 0,
            yPercent: 0,
            rotate: 0,
            duration: runtime.durL,
            ease: "Out",
            overwrite: !0,
          },
        ),
        gsap.fromTo(
          a,
          { opacity: 0 },
          { opacity: 1, duration: runtime.durL, ease: "Out", overwrite: !0 },
        ),
        animateTextH(s, "reveal"),
        animateCtn(c, "reveal", 0.3),
        animateLine(l, "reveal", 0.3),
        lockScroll());
    }
    function o(): any {
      (gsap.to(r, {
        scale: 1,
        rotateX: 90,
        yPercent: 200,
        rotate: 25,
        duration: runtime.durM,
        ease: "In",
        overwrite: !0,
      }),
        gsap.to(a, {
          opacity: 0,
          duration: runtime.durM,
          ease: "In",
          onComplete: (): any => {
            gsap.set([i, a], { display: "none" });
          },
          overwrite: !0,
        }),
        unlockScroll());
    }
    const n: any = e.getAttribute("modal-cta-open"),
      i: any = document.querySelector(`[modal-cta="${n}"]`),
      r: any = document.querySelector(`[modal-cta-main="${n}"]`),
      a: any = document.querySelector(`[modal-cta-over="${n}"]`),
      s: any = document.querySelectorAll(`[modal-cta-headline="${n}"]`),
      c: any = document.querySelectorAll(`[modal-cta-container="${n}"]`),
      l: any = document.querySelectorAll(`[modal-cta-line="${n}"]`),
      d: any = document.querySelectorAll(`[modal-cta-close="${n}"]`);
    if (!i) return;
    let u: any = !1;
    (gsap.set(i, { display: "none" }),
      gsap.set(r, { transformPerspective: 1e3 }),
      listen(e, "click", (): any => {
        u || (t(), (u = !0));
      }),
      d.forEach((e?: any): any => {
        listen(e, "click", (): any => {
          u && (o(), (u = !1));
        });
      }));
  });
}
export function initModalMedia(): any {
  document.querySelectorAll("[modal-media-open]").forEach((e?: any): any => {
    function t(): any {
      (gsap.set(i, { display: "block", opacity: 1 }),
        r &&
          ((r.src = l),
          (r.muted = !1),
          (r.controls = !1),
          (r.volume = 0.25),
          (r.currentTime = 0),
          r.play().catch((): any => {}),
          gsap.fromTo(
            r,
            { scale: 2 },
            { scale: 1, duration: runtime.durL, ease: "Out", overwrite: !0 },
          )),
        a &&
          gsap.fromTo(
            a,
            { scale: 2 },
            { scale: 1, duration: runtime.durL, ease: "Out", overwrite: !0 },
          ),
        gsap.fromTo(
          i,
          {
            display: "block",
            "--mask-y": "200%",
            "--mask-size": "100% 400%",
            opacity: 1,
          },
          {
            "--mask-y": "0%",
            "--mask-size": "100% 400%",
            duration: 1.5 * runtime.durL,
            ease: "Out",
            overwrite: !0,
          },
        ),
        lockScroll());
    }
    function o(): any {
      (gsap.to(i, {
        opacity: 0,
        duration: runtime.durS,
        ease: "In",
        onComplete: (): any => {
          (gsap.set(i, { display: "none" }),
            r && (r.pause(), r.removeAttribute("src"), r.load()));
        },
        overwrite: !0,
      }),
        r &&
          gsap.to(r, {
            scale: 1.25,
            duration: runtime.durS,
            ease: "In",
            overwrite: !0,
          }),
        a &&
          gsap.to(a, {
            scale: 1.25,
            duration: runtime.durS,
            ease: "In",
            overwrite: !0,
          }),
        unlockScroll());
    }
    const n: any = e.getAttribute("modal-media-open"),
      i: any = document.querySelector(`[modal-media="${n}"]`),
      r: any = document.querySelector(`[modal-media-video="${n}"]`),
      a: any = document.querySelector(`[modal-media-gallery="${n}"]`),
      s: any = document.querySelectorAll(`[modal-media-close="${n}"]`);
    if (!i) return;
    let c: any = !1;
    const l: any = "/assets/son-daven.MP4";
    (r && (r.removeAttribute("src"), r.load()),
      gsap.set(i, { display: "none" }),
      listen(e, "click", (): any => {
        c || (t(), (c = !0));
      }),
      s.forEach((e?: any): any => {
        listen(e, "click", (): any => {
          c && (o(), (c = !1));
        });
      }));
  });
}
export function initModalMenu(): any {
  document.querySelectorAll("[modal-menu-open]").forEach((e?: any): any => {
    function t(): any {
      (c.classList.add("theme_on-dark"),
        u.forEach((e?: any): any => e.classList.toggle("d-none")),
        gsap.fromTo(
          i,
          {
            display: "block",
            "--mask-y": "200%",
            "--mask-size": "100% 400%",
            opacity: 1,
          },
          {
            "--mask-y": "0%",
            "--mask-size": "100% 400%",
            duration: 1.5 * runtime.durL,
            ease: "Out",
            overwrite: !0,
          },
        ),
        gsap
          .timeline({ defaults: { duration: runtime.durM, ease: "InOut" } })
          .to(l, { rotate: 45, yPercent: 10, overwrite: !0 })
          .to(d, { rotate: -45, yPercent: -10, overwrite: !0 }, "<"),
        gsap
          .timeline({ defaults: { duration: runtime.durS, ease: "InOut" } })
          .to(g, { yPercent: 15, overwrite: !0 })
          .to(m, { yPercent: -15, overwrite: !0 }, "<")
          .to(p, { scaleX: 0, overwrite: !0 }, "<")
          .to(g, { rotate: 45 })
          .to(m, { rotate: -45 }, "<"),
        animateTextH(a, "reveal", 0.4),
        animateCtn(s, "reveal", 0.4),
        lockScroll());
    }
    function o(): any {
      (c.classList.remove("theme_on-dark"),
        u.forEach((e?: any): any => e.classList.toggle("d-none")),
        gsap.to(i, {
          opacity: 0,
          duration: runtime.durM,
          ease: "Out",
          delay: 0.4,
          onComplete: (): any => gsap.set(i, { display: "none" }),
          overwrite: !0,
        }),
        gsap
          .timeline({ defaults: { duration: runtime.durM, ease: "InOut" } })
          .to(l, { rotate: 0, yPercent: 0, overwrite: !0 })
          .to(d, { rotate: 0, yPercent: 0, overwrite: !0 }, "<"),
        gsap
          .timeline({ defaults: { duration: runtime.durS, ease: "InOut" } })
          .to(g, { rotate: 0, overwrite: !0 })
          .to(m, { rotate: 0, overwrite: !0 }, "<")
          .to(g, { yPercent: 0 })
          .to(p, { scaleX: 1, overwrite: !0 }, "<")
          .to(m, { yPercent: 0 }, "<"),
        animateTextH(a, "hide"),
        animateCtn(s, "hide"),
        unlockScroll());
    }
    const n: any = e.getAttribute("modal-menu-open"),
      i: any = document.querySelector(`[modal-menu="${n}"]`),
      r: any = document.querySelectorAll(`[modal-menu-close="${n}"]`),
      a: any = document.querySelectorAll(`[modal-menu-headline="${n}"]`),
      s: any = document.querySelectorAll(`[modal-menu-ctn="${n}"]`),
      c: any = document.querySelector(".header"),
      l: any = document.querySelector(".menu-btn_ico_line.top"),
      d: any = document.querySelector(".menu-btn_ico_line.bot"),
      u: any = document.querySelectorAll(".menu-btn_label"),
      g: any = document.querySelector(".mob_menu-btn_ico_line.top"),
      p: any = document.querySelector(".mob_menu-btn_ico_line.center"),
      m: any = document.querySelector(".mob_menu-btn_ico_line.bot");
    if (!i) return;
    let h: any = !1;
    (gsap.set(i, { display: "none" }),
      listen(e, "click", (): any => {
        h ? (o(), (h = !1)) : (t(), (h = !0));
      }),
      r.forEach((e?: any): any => {
        listen(e, "click", (): any => {
          h && (o(), (h = !1));
        });
      }));
  });
}
export function initModalVimVideo(): any {
  document
    .querySelectorAll("[data-modal-vim-video-btn]")
    .forEach((e?: any): any => {
      function t(): any {
        (gsap.set([i, r], { display: "block" }),
          s && s.contentWindow.postMessage('{"method":"play"}', "*"),
          lockScroll());
      }
      function o(): any {
        (s && s.contentWindow.postMessage('{"method":"pause"}', "*"),
          gsap.set([i, r], { display: "none" }),
          unlockScroll());
      }
      const n: any = e.getAttribute("data-modal-vim-video-btn"),
        i: any = document.querySelector(`[data-modal-vim-video="${n}"]`);
      if (!i) return;
      i.querySelector("[data-modal-container]");
      const r: any = i.querySelector("[data-modal-over]"),
        a: any = i.querySelectorAll("[data-modal-close]"),
        s: any = i.querySelector("iframe");
      let c: any = !1;
      (gsap.set(i, { display: "none" }),
        listen(e, "click", (): any => {
          c || (t(), (c = !0));
        }),
        a.forEach((e?: any): any => {
          listen(e, "click", (): any => {
            c && (o(), (c = !1));
          });
        }));
    });
}
