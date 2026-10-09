/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime, gsap, Swiper } from "../core/runtime";
import {
  listen,
  manageObserver,
  managedInterval,
  managedTimeout,
  matchMedia,
} from "../core/Lifecycle";
import { animateTextH, animateTextP } from "../motion/text";
export function initSlider(): any {
  const e: any = gsap.utils.toArray("[slider]");
  e.length &&
    e.forEach((e?: any): any => {
      function t(): any {
        n.$current &&
          n.$total &&
          ((n.$current.textContent = n.current + 1),
          (n.$total.textContent = n.length));
      }
      function o(e?: any): any {
        ((n.$slides[n.prev].style.zIndex = 1),
          (n.$slides[n.current].style.zIndex = 2),
          gsap
            .timeline()
            .fromTo(
              n.$imgs[n.prev],
              { scale: 1 },
              { duration: runtime.durL, scale: 1.5, ease: "Ease" },
              "<",
            ),
          gsap
            .timeline()
            .fromTo(
              n.$slides[n.current],
              { clipPath: e ? i : r },
              {
                clipPath: a,
                duration: runtime.durL,
                ease: "Ease",
                onComplete: (): any => {
                  ((n.$slides[n.prev].style.zIndex = "auto"),
                    (n.$slides[n.current].style.zIndex = 1),
                    (n.animating = !1));
                },
              },
            )
            .fromTo(
              n.$imgs[n.current],
              { scale: 1.5 },
              { scale: 1, duration: runtime.durL, ease: "Ease" },
              "<",
            ));
      }
      const n: any = {
        $slides: e.querySelectorAll('[slider="slide"]'),
        $imgs: e.querySelectorAll('[slider="slide"] [slider="img"]'),
        $pag: e.querySelector('[slider="pag"]'),
        $prev: e.querySelector('[slider="prev"]'),
        $next: e.querySelector('[slider="next"]'),
        $current: e.querySelector('[slider="current"]'),
        $total: e.querySelector('[slider="total"]'),
        current: 0,
        prev: null,
        animating: !1,
      };
      if (((n.length = n.$slides.length), !n.length || !n.$prev || !n.$next))
        return;
      if (1 === n.length) return void (n.$pag.style.display = "none");
      const i: any = "inset(0% 0% 0% 100%)",
        r: any = "inset(0% 100% 0% 0%)",
        a: any = "inset(0% 0% 0% 0%)";
      (gsap.set(n.$slides, { clipPath: r }),
        gsap.set(n.$slides[n.current], { clipPath: a }),
        t(),
        listen(n.$prev, "click", (): any => {
          n.animating ||
            ((n.animating = !0),
            (n.prev = n.current),
            (n.current = 0 === n.current ? n.length - 1 : n.current - 1),
            t(),
            o(!1));
        }),
        listen(n.$next, "click", (): any => {
          n.animating ||
            ((n.animating = !0),
            (n.prev = n.current),
            (n.current = n.current === n.length - 1 ? 0 : n.current + 1),
            t(),
            o(!0));
        }));
    });
}
export function initSliderText(): any {
  const e: any = gsap.utils.toArray("[slider-text]");
  e.length &&
    e.forEach((e?: any): any => {
      function t(): any {
        ((a.$slides[a.prev].style.zIndex = 0),
          (a.$slides[a.current].style.zIndex = 1),
          gsap
            .timeline({
              onComplete: (): any => {
                ((a.$slides[a.prev].style.zIndex = "auto"),
                  (a.$slides[a.current].style.zIndex = 1),
                  (a.animating = !1));
              },
            })
            .call(
              (): any => {
                (animateTextH(a.$headlines[a.prev], "hide", 0),
                  animateTextP(a.$paragraphs[a.prev], "hide", 0));
              },
              [],
              0,
            )
            .to(
              a.$circles[a.prev],
              { opacity: 0, scale: 1.25, duration: runtime.durS, ease: "In" },
              0,
            )
            .set(a.$slides[a.prev], {
              display: "none",
              position: "absolute",
              delay: 0.1,
            })
            .set(a.$slides[a.current], {
              display: "block",
              position: "relative",
            })
            .call((): any => {
              (animateTextH(a.$headlines[a.current], "reveal", 0),
                animateTextP(a.$paragraphs[a.current], "reveal", 0));
            })
            .fromTo(
              a.$circles[a.current],
              { opacity: 0, scale: 0 },
              { opacity: 1, scale: 1, duration: runtime.durL, ease: "Out" },
              "<",
            ));
      }
      function o(): any {
        a.$current &&
          a.$total &&
          ((a.$current.textContent = a.current + 1),
          (a.$total.textContent = a.length));
      }
      function n(): any {
        if (!a.$progressLines.length) return;
        const e: any = a.$progressLines[a.current],
          t: any = e.r.baseVal.value,
          o: any = 2 * Math.PI * t;
        ((e.style.strokeDasharray = o),
          (e.style.strokeDashoffset = o),
          gsap.fromTo(
            e,
            { strokeDashoffset: o },
            {
              strokeDashoffset: 0,
              duration: a.autoplayDuration - runtime.durM,
              ease: "none",
              delay: runtime.durM,
            },
          ));
      }
      function i(): any {
        a.isInViewport &&
          (n(),
          (a.autoplayInterval = managedInterval((): any => {
            a.animating ||
              ((a.animating = !0),
              (a.prev = a.current),
              (a.current = a.current === a.length - 1 ? 0 : a.current + 1),
              o(),
              t(),
              n());
          }, 1e3 * a.autoplayDuration)));
      }
      function r(): any {
        (a.autoplayInterval &&
          (clearInterval(a.autoplayInterval), (a.autoplayInterval = null)),
          a.$progressLines.length &&
            gsap.killTweensOf(a.$progressLines[a.current]));
      }
      const a: any = {
        $slides: e.querySelectorAll('[slider="slide"]'),
        $headlines: e.querySelectorAll('[slider="slide"] [slider="ctn"]'),
        $paragraphs: e.querySelectorAll('[slider="slide"] [slider="p"]'),
        $circles: e.querySelectorAll('[slider="slide"] [slider="circle"]'),
        $progressLines: e.querySelectorAll(
          '[slider="slide"] [slider="progress-line"]',
        ),
        $pag: e.querySelector('[slider="pag"]'),
        $prev: e.querySelector('[slider="prev"]'),
        $next: e.querySelector('[slider="next"]'),
        $current: e.querySelector('[slider="current"]'),
        $total: e.querySelector('[slider="total"]'),
        current: 0,
        prev: null,
        animating: !1,
        autoplayDuration: 6,
        autoplayInterval: null,
        isInViewport: !1,
      };
      if (((a.length = a.$slides.length), !a.length || !a.$prev || !a.$next))
        return;
      if (1 === a.length) return void (a.$pag.style.display = "none");
      (gsap.set(a.$slides, { display: "none", position: "absolute" }),
        gsap.set(a.$slides[a.current], {
          display: "block",
          position: "relative",
        }));
      (manageObserver(
        new IntersectionObserver(
          (e?: any): any => {
            e.forEach((e?: any): any => {
              e.isIntersecting
                ? ((a.isInViewport = !0), i())
                : ((a.isInViewport = !1), r());
            });
          },
          { threshold: 0 },
        ),
      ).observe(e),
        listen(a.$prev, "click", (): any => {
          a.animating ||
            (r(),
            (a.animating = !0),
            (a.prev = a.current),
            (a.current = 0 === a.current ? a.length - 1 : a.current - 1),
            o(),
            t(),
            i());
        }),
        listen(a.$next, "click", (): any => {
          a.animating ||
            (r(),
            (a.animating = !0),
            (a.prev = a.current),
            (a.current = a.current === a.length - 1 ? 0 : a.current + 1),
            o(),
            t(),
            i());
        }),
        o());
    });
}
export function initSliderFreemode(): any {
  document.querySelectorAll("[slider-id]").forEach((e?: any): any => {
    const t: any = e.getAttribute("slider-id"),
      o: any = e.querySelector(".swiper");
    if (!o) return;
    new Swiper(o, {
      direction: "horizontal",
      freeMode: {
        enabled: !0,
        momentum: !0,
        momentumRatio: 1,
        momentumBounce: !0,
        momentumBounceRatio: 1,
        sticky: !1,
      },
      a11y: { enabled: !1 },
      slidesPerView: "auto",
      grabCursor: !0,
      mousewheel: { forceToAxis: !0 },
      navigation: {
        nextEl: `[slider-id="${t}"] [slider="next"]`,
        prevEl: `[slider-id="${t}"] [slider="prev"]`,
      },
      speed: 800,
    });
  });
}
