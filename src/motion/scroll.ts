/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime, gsap, ScrollTrigger, SplitText } from "../core/runtime";
import {
  listen,
  manageObserver,
  managedInterval,
  managedTimeout,
  matchMedia,
} from "../core/Lifecycle";
import {
  animateTextH,
  animateTextP,
  animateCtn,
  animateLine,
} from "../motion/text";
export function initThemeChange(): any {
  function e(e?: any, o?: any, n?: any): any {
    "none" !== getComputedStyle(e).display &&
      t.forEach((t?: any): any => {
        const i: any = t.offsetHeight,
          r: any = t.getBoundingClientRect().top;
        ScrollTrigger.create({
          trigger: e,
          start: (): any => `top top+=${r + i / 2}`,
          end: (): any => `bottom top+=${r + i / 2}`,
          onEnter: (): any => {
            (t.classList.add(o), t.classList.remove(...n));
          },
          onEnterBack: (): any => {
            (t.classList.add(o), t.classList.remove(...n));
          },
        });
      });
  }
  const t: any = document.querySelectorAll("[theme]");
  t.length &&
    (document.querySelectorAll('[bg="color"]').forEach((t?: any): any => {
      e(t, "theme_on-dark", ["theme_on-light"]);
    }),
    document.querySelectorAll('[bg="light"]').forEach((t?: any): any => {
      e(t, "theme_on-light", ["theme_on-dark"]);
    }),
    document.querySelectorAll('[bg="dark"]').forEach((t?: any): any => {
      e(t, "theme_on-dark", ["theme_on-light"]);
    }));
}
export function initHeaderHide(): any {
  const e: any = document.querySelector(".header");
  if (!e) return;
  const t: any = e.querySelector(".header_bg");
  let o: any = window.scrollY,
    n: any = !1,
    i: any = window.scrollY > 1e3;
  (gsap.set(t, { opacity: i ? 1 : 0 }),
    ScrollTrigger.create({
      start: "top top",
      end: "max",
      onUpdate: (r?: any): any => {
        const a: any = r.scroll(),
          s: any = Math.abs(a - o),
          c: any =
            document.documentElement.scrollHeight - (a + window.innerHeight);
        if (
          (a > 1e3
            ? ((i = !0),
              gsap.to(t, { opacity: 1, duration: runtime.durS, ease: "Out" }))
            : gsap.to(t, { opacity: 0, duration: runtime.durS, ease: "Out" }),
          !(s < 40))
        ) {
          if (
            (a > o && i && !n
              ? gsap.to(e, {
                  yPercent: -100,
                  duration: runtime.durM,
                  ease: "Out",
                  onComplete: (): any => (n = !0),
                })
              : a < o &&
                n &&
                gsap.to(e, {
                  yPercent: 0,
                  duration: runtime.durM,
                  ease: "Out",
                  onComplete: (): any => (n = !1),
                }),
            c <= 160)
          )
            return (
              gsap.to(e, {
                yPercent: 0,
                duration: runtime.durM,
                ease: "Out",
                onComplete: (): any => (n = !1),
              }),
              void (o = a)
            );
          o = a;
        }
      },
    }));
}
export function initAllParallax(): any {
  (gsap.utils.toArray('[parallax="img"]').forEach((e?: any): any => {
    const t: any = e.closest('[parallax="w"]');
    t &&
      gsap.fromTo(
        e,
        { yPercent: -20 },
        {
          yPercent: 20,
          ease: "none",
          scrollTrigger: {
            trigger: t,
            start: "top bottom",
            scrub: !0,
          },
        },
      );
  }),
    gsap.utils.toArray('[parallax="img-out"]').forEach((e?: any): any => {
      const t: any = e.closest('[parallax="w"]');
      t &&
        gsap.fromTo(
          e,
          { yPercent: -10 },
          {
            yPercent: 30,
            ease: "none",
            scrollTrigger: {
              trigger: t,
              start: "top 50%",
              end: "bottom top",
              scrub: !0,
            },
          },
        );
    }),
    gsap.utils.toArray('[parallax="ctn-down"]').forEach((e?: any): any => {
      if (!e) return;
      const t: any = "false" === e.getAttribute("mob"),
        o: any = window.innerWidth < runtime.breakPoint;
      (t && o) ||
        gsap.fromTo(
          e,
          { yPercent: -10 },
          {
            yPercent: 10,
            ease: "none",
            scrollTrigger: {
              trigger: e,
              start: "top bottom",
              end: "bottom top",
              scrub: !0,
            },
          },
        );
    }),
    gsap.utils.toArray('[parallax="ctn-up"]').forEach((e?: any): any => {
      if (!e) return;
      const t: any = "false" === e.getAttribute("mob"),
        o: any = window.innerWidth < runtime.breakPoint;
      (t && o) ||
        gsap.fromTo(
          e,
          { yPercent: 10 },
          {
            yPercent: -10,
            ease: "none",
            scrollTrigger: {
              trigger: e,
              start: "top bottom",
              end: "bottom top",
              scrub: !0,
            },
          },
        );
    }),
    gsap.utils.toArray('[parallax="h1"]').forEach((e?: any): any => {
      const t: any = Array.from(e.children);
      0 !== t.length &&
        gsap.fromTo(
          t,
          { xPercent: gsap.utils.wrap([5, -1, -5]) },
          {
            xPercent: gsap.utils.wrap([-5, 1, 5]),
            ease: "none",
            scrollTrigger: {
              trigger: e,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
    }));
}
export function initSectionTransition(): any {
  const e: any = document.querySelector(".about-s_img");
  if (e) {
    const t: any = e.querySelector(".img-w");
    gsap.fromTo(
      t,
      { scale: 1, transformOrigin: "center bottom" },
      {
        scale: 1.25,
        ease: "none",
        scrollTrigger: {
          trigger: e,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      },
    );
  }
  const t: any = document.querySelector(".benefits-w");
  if (t) {
    const e: any = t.querySelector(".benefits-s_title-w"),
      o: any = t.querySelector(".benefits-s_title"),
      n: any = t.querySelector(".benefits-s_scene-intro"),
      i: any = t.querySelector(".benefits-s_scene-outro"),
      r: any = t.querySelector(".benefits-s_gap");
    (e &&
      gsap.fromTo(
        e,
        { scale: 0 },
        {
          scale: 1,
          ease: "InOut",
          scrollTrigger: {
            trigger: r,
            start: "top bottom",
            end: "bottom bottom",
            scrub: !0,
          },
        },
      ),
      gsap.fromTo(
        [o, n],
        { opacity: 1 },
        {
          opacity: 0,
          ease: "Out",
          scrollTrigger: {
            trigger: i,
            start: "bottom top",
            end: "200% top",
            scrub: !0,
          },
        },
      ));
  }
  (matchMedia({
    [`(min-width: ${runtime.breakPoint}px)`]: function (this: any): any {
      const e: any = document.querySelector(".benefits-s_cms");
      if (e) {
        const t: any = e.querySelector(".benefits-cms_list"),
          o: any = t.querySelectorAll(".benefits-cms_list_item"),
          n: any = gsap.to(t, {
            xPercent: -100,
            ease: "none",
            scrollTrigger: {
              trigger: e,
              scrub: !0,
              start: "top top",
              end: "bottom bottom",
            },
          });
        o.forEach((e?: any, t?: any): any => {
          const o: any = {
            x: (10 * Math.random() + 20) * (Math.random() < 0.5 ? 1 : -1),
            y: (0 * Math.random() + 5) * (Math.random() < 0.5 ? 1 : -1),
            rotation: (5 * Math.random() + 5) * (Math.random() < 0.5 ? 1 : -1),
          };
          gsap.fromTo(
            e,
            {
              rotation: o.rotation,
              xPercent: o.x,
              yPercent: o.y + 75 + (t % 2 == 0 ? 15 : -15),
            },
            {
              rotation: -o.rotation,
              xPercent: -o.x,
              yPercent: -o.y - 75 + (t % 2 == 0 ? -15 : 15),
              ease: "none",
              scrollTrigger: {
                trigger: e,
                containerAnimation: n,
                start: "left 120%",
                end: "right -20%",
                scrub: !0,
              },
            },
          );
        });
      }
    },
  }),
    matchMedia({
      [`(min-width: ${runtime.breakPoint}px)`]: function (this: any): any {
        const e: any = document.querySelector(".footer");
        if (e) {
          const t: any = e.querySelector(".footer-w"),
            o: any = e.querySelector(".footer-w_bg");
          gsap
            .timeline({
              scrollTrigger: {
                trigger: e,
                start: "top top",
                end: "bottom bottom",
                scrub: !0,
              },
            })
            .fromTo(
              t,
              { scale: 2, translateZ: 10, transformOrigin: "center 10%" },
              { scale: 1, ease: "none" },
            )
            .fromTo(
              o,
              { scale: 0.75, translateZ: 10, transformOrigin: "center 10%" },
              { scale: 1, ease: "none" },
              "<",
            );
        }
      },
    }));
}
export function initScrollElementsReveal(): any {
  const e: any = document.querySelectorAll('[data-scroll-reveal="h"]');
  e.length &&
    e.forEach((e?: any): any => {
      const t: any = e.closest('[data-scroll-reveal="w"]');
      (animateTextH(e, "initial"),
        gsap.set(e, { visibility: "visible" }),
        ScrollTrigger.create({
          trigger: t || e,
          start: "top bottom",
          once: !0,
          onEnter: (): any => {
            animateTextH(e, "reveal", 0);
          },
        }));
    });
  const t: any = document.querySelectorAll('[data-scroll-reveal="p"]');
  t.length &&
    t.forEach((e?: any): any => {
      const t: any = e.closest('[data-scroll-reveal="w"]');
      (animateTextP(e, "initial"),
        gsap.set(e, { visibility: "visible" }),
        ScrollTrigger.create({
          trigger: t || e,
          start: "top bottom",
          once: !0,
          onEnter: (): any => {
            animateTextP(e, "reveal", 0);
          },
        }));
    });
  const o: any = document.querySelectorAll('[data-scroll-reveal="ctn"]');
  o.length &&
    o.forEach((e?: any): any => {
      const t: any = e.closest('[data-scroll-reveal="w"]');
      (animateCtn(e, "initial"),
        gsap.set(e, { visibility: "visible" }),
        ScrollTrigger.create({
          trigger: t || e,
          start: "top bottom",
          once: !0,
          onEnter: (): any => {
            animateCtn(e, "reveal", 0);
          },
        }));
    });
  const n: any = document.querySelectorAll('[data-scroll-reveal="line"]');
  n.length &&
    n.forEach((e?: any): any => {
      const t: any = e.closest('[data-scroll-reveal="w"]');
      (animateLine(e, "initial"),
        gsap.set(e, { visibility: "visible" }),
        ScrollTrigger.create({
          trigger: t || e,
          start: "top bottom",
          once: !0,
          onEnter: (): any => {
            animateLine(e, "reveal", 0);
          },
        }));
    });
  const i: any = document.querySelectorAll('[data-scroll-reveal="card"]');
  (i.length &&
    i.forEach((e?: any): any => {
      const t: any = e.closest('[data-scroll-reveal="w"]');
      (gsap.set(e, { transformPerspective: 1e3, visibility: "visible" }),
        gsap
          .timeline({
            scrollTrigger: {
              trigger: t || e,
              start: "top bottom",
              toggleActions: "play none none reset",
            },
          })
          .from(e, {
            scale: 0,
            rotateY: -90,
            rotate: -25,
            duration: runtime.durL,
            delay: runtime.delayReveal,
            ease: "Out",
          }));
    }),
    document
      .querySelectorAll('[data-slider-reveal="true"]')
      .forEach((e?: any): any => {
        const t: any = Array.from(e.children);
        t.length &&
          (gsap.set(t, { visibility: "visible" }),
          gsap
            .timeline({
              scrollTrigger: {
                trigger: e,
                start: "top bottom",
                end: "top 80%",
                toggleActions: "play none none none",
              },
            })
            .from(t, {
              opacity: 0,
              xPercent: 50,
              duration: runtime.durL,
              delay: runtime.delayReveal,
              stagger: runtime.stagger,
              ease: "Out",
            }),
          gsap.set(t, { visibility: "visible" }));
      }));
  const r: any = document.querySelector("[header]");
  r &&
    (gsap
      .timeline({})
      .from(r, { yPercent: -100, duration: runtime.durL, ease: "InOut" }),
    gsap.set(r, { visibility: "visible" }));
  const a: any = document.querySelector("[cookies]");
  a &&
    (gsap
      .timeline({})
      .from(a, { yPercent: 100, duration: runtime.durL, ease: "InOut" }),
    gsap.set(a, { visibility: "visible" }));
  const s: any = document.querySelector(".sound-w");
  s &&
    (gsap.from(s, { yPercent: 125, duration: runtime.durL, ease: "InOut" }),
    gsap.set(s, { visibility: "visible" }));
}
export function initHighlightText(): any {
  const e: any = Array.from(document.querySelectorAll("[data-highlight-text]"));
  e.length &&
    e.forEach((e?: any): any => {
      const t: any = new SplitText(e, {
        type: "chars",
        smartWrap: !0,
        charsClass: "split-char",
      }).chars;
      if (!t || !t.length) return;
      const o: any = e.closest("[data-highlight-wrapper]") || e;
      gsap
        .timeline({
          scrollTrigger: {
            trigger: o,
            start: "top 75%",
            end: "bottom 50%",
            scrub: !0,
          },
        })
        .from(t, {
          opacity: 0.1,
          duration: runtime.durS,
          ease: "Out",
          stagger: runtime.stagger,
        });
    });
}
export function initMarquee(): any {
  document.querySelectorAll("[data-marquee]").forEach((e?: any): any => {
    const t: any = e.querySelectorAll('[data-marquee="list"]');
    if (!t.length) return;
    const o: any = gsap
      .timeline({ repeat: -1 })
      .to(t, { duration: 24, xPercent: -100, ease: "linear" });
    ScrollTrigger.create({
      trigger: e,
      start: "top bottom",
      end: "bottom top",
      onEnter: (): any => o.play(),
      onLeave: (): any => o.pause(),
      onEnterBack: (): any => o.play(),
      onLeaveBack: (): any => o.pause(),
      onUpdate: (e?: any): any => {
        const t: any = 0.01 * e.getVelocity();
        o.timeScale(1 + t);
      },
    });
  });
}
export function initPlayPauseVideoScroll(): any {
  gsap.utils.toArray('[data-video="playpause"]').forEach((e?: any): any => {
    const t: any = e.querySelector("video");
    t &&
      (t.load(),
      (t.currentTime = 0),
      ScrollTrigger.create({
        trigger: e,
        start: "top bottom",
        end: "bottom top",
        onEnter: (): any => t.play().catch((): any => {}),
        onEnterBack: (): any => t.play().catch((): any => {}),
        onLeave: (): any => t.pause(),
        onLeaveBack: (): any => t.pause(),
      }));
  });
}
export function initScrollVideo(): any {
  (matchMedia({
    [`(min-width: ${runtime.breakPoint}px)`]: function (this: any): any {
      const e: any = document.querySelector("[data-scroll-video-container]");
      if (!e) return;
      const t: any = e.querySelector("[data-scroll-video]"),
        o: any = t.getContext("2d"),
        n: any = [],
        i: any = (e?: any): any => {
          ((t.width = t.offsetWidth), (t.height = t.offsetHeight));
          const n: any = Math.max(t.width / e.width, t.height / e.height),
            i: any = (t.width - e.width * n) / 2,
            r: any = (t.height - e.height * n) / 2;
          o.drawImage(e, i, r, e.width * n, e.height * n);
        };
      runtime.framesPromise.then((t?: any): any => {
        (n.push(...t.filter(Boolean)),
          i(n[0]),
          gsap.to(
            { frame: 0 },
            {
              frame: n.length - 1,
              snap: "frame",
              ease: "none",
              scrollTrigger: {
                trigger: e,
                start: "top top",
                end: "75% bottom",
                scrub: 0.25,
              },
              onUpdate(this: any): any {
                i(n[Math.round(this.targets()[0].frame)]);
              },
            },
          ));
      });
    },
  }),
    matchMedia({
      [`(min-width: ${runtime.breakPoint}px)`]: function (this: any): any {
        const e: any = document.querySelector(".hero-scroll-area");
        if (e) {
          const t: any = e.querySelector(".hero-w"),
            o: any = e.querySelector(".hero-s"),
            n: any = e.querySelector(".hero-s_t");
          (gsap.to(n, {
            scrollTrigger: {
              trigger: e,
              start: "top top",
              end: "50% bottom",
              scrub: 0.25,
            },
            yPercent: -100,
            scale: 0.5,
            opacity: 0,
            ease: "none",
          }),
            gsap
              .timeline({
                scrollTrigger: {
                  trigger: e,
                  start: "70% bottom",
                  end: "bottom bottom",
                  scrub: 1,
                },
              })
              .to(t, { scale: 0.3, ease: "Out", duration: 1 }, 0)
              .to(o, { opacity: 0, ease: "Out", duration: 0.33 }, 0));
        }
      },
    }));
}
