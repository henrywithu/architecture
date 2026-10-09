/** Source-derived behavior: research/main-original.js. Constants and algorithms are preserved.
 * Dynamic DOM protocols use explicit adapter types; application boundaries are strictly typed. */
import { runtime } from '../core/runtime';
import { listen, manageObserver } from '../core/Lifecycle';

import vertexShader from './shaders/halftone.vertex.glsl?raw';
import fragmentShader from './shaders/halftone.fragment.glsl?raw';
export function initCanvasEffect(e?: any, t?: any, o: any = {}): any {
    const n: any = "string" == typeof e ? document.querySelectorAll(e) : [e];
    if (!n.length)
        return;
    const i: any = Array.from(n)
        .map((e?: any): any => createCanvasInstance(e, t, o))
        .filter(Boolean);
    return {
        destroy: (): any => i.forEach((e?: any): any => e.destroy()),
        loaded: Promise.all(i.map((e?: any): any => e.loaded)),
    };
}
export function createCanvasInstance(e?: any, t?: any, o: any = {}): any {
    if (!e)
        return null;
    const n: any = 1.5, i: any = 2, r: any = 1e3 / (o.fps || 60), a: any = {
        ...{
            blur: 0,
            gamma: 1,
            blackPoint: 0,
            whitePoint: 255,
            threshold: 255,
            ySquares: 100,
            xSquares: 100,
            minSquareWidth: "-2%",
            maxSquareWidth: "102%",
            fps: 60,
            x: 0,
            y: 0,
            width: "100%",
            height: "100%",
            bgOpacity: 1,
            fillOpacity: 1,
        },
        ...o,
    }, s: any = { vertex: vertexShader, fragment: fragmentShader }, c: any = (e?: any, t?: any): any => "string" != typeof e
        ? e
        : e.endsWith("%")
            ? (parseFloat(e) / 100) * t
            : e.endsWith("vw")
                ? (parseFloat(e) / 100) *
                    q *
                    Math.min(window.devicePixelRatio || 1, n)
                : parseFloat(e), l: any = (e?: any): any => {
        if (!e)
            return [0, 0, 0];
        const t: any = e.replace("#", "").trim(), o: any = 3 === t.length ? t[0] + t[0] + t[1] + t[1] + t[2] + t[2] : t;
        return [
            parseInt(o.slice(0, 2), 16) / 255,
            parseInt(o.slice(2, 4), 16) / 255,
            parseInt(o.slice(4, 6), 16) / 255,
        ];
    }, d: any = (): any => {
        const e: any = getComputedStyle(document.documentElement);
        return {
            bg: l(e.getPropertyValue("--_colors---base-0--100").trim() || "#000000"),
            fill: l(e.getPropertyValue("--_colors---base-1000--100").trim() || "#ffffff"),
        };
    }, u: any = e.getContext("webgl", {
        alpha: !0,
        antialias: !1,
        premultipliedAlpha: !1,
        preserveDrawingBuffer: !1,
        powerPreference: "high-performance",
    });
    if (!u)
        return null;
    const g: any = (e?: any, t?: any): any => {
        const o: any = u.createShader(e);
        return (u.shaderSource(o, t), u.compileShader(o), o);
    }, p: any = (e?: any, t?: any): any => {
        const o: any = u.createProgram();
        return (u.attachShader(o, e), u.attachShader(o, t), u.linkProgram(o), o);
    }, m: any = p(g(u.VERTEX_SHADER, s.vertex), g(u.FRAGMENT_SHADER, s.fragment));
    if (!m)
        return null;
    u.useProgram(m);
    const h: any = {
        aPos: u.getAttribLocation(m, "a_position"),
        aUV: u.getAttribLocation(m, "a_texCoord"),
        uTex: u.getUniformLocation(m, "u_texture"),
        uRes: u.getUniformLocation(m, "u_resolution"),
        uTexSize: u.getUniformLocation(m, "u_texSize"),
        uGrid: u.getUniformLocation(m, "u_gridSize"),
        uMinW: u.getUniformLocation(m, "u_minWidth"),
        uMaxW: u.getUniformLocation(m, "u_maxWidth"),
        uThr: u.getUniformLocation(m, "u_threshold"),
        uGam: u.getUniformLocation(m, "u_gamma"),
        uBP: u.getUniformLocation(m, "u_blackPoint"),
        uWP: u.getUniformLocation(m, "u_whitePoint"),
        uBg: u.getUniformLocation(m, "u_bgColor"),
        uFill: u.getUniformLocation(m, "u_fillColor"),
        uBgOpacity: u.getUniformLocation(m, "u_bgOpacity"),
        uFillOpacity: u.getUniformLocation(m, "u_fillOpacity"),
        uBounds: u.getUniformLocation(m, "u_bounds"),
    }, y: any = (e?: any): any => {
        const t: any = u.createBuffer();
        return (u.bindBuffer(u.ARRAY_BUFFER, t),
            u.bufferData(u.ARRAY_BUFFER, e, u.STATIC_DRAW),
            t);
    }, f: any = {
        position: y(new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1])),
        texCoord: y(new Float32Array([0, 1, 1, 1, 0, 0, 1, 0])),
    };
    (u.bindBuffer(u.ARRAY_BUFFER, f.position),
        u.enableVertexAttribArray(h.aPos),
        u.vertexAttribPointer(h.aPos, 2, u.FLOAT, !1, 0, 0),
        u.bindBuffer(u.ARRAY_BUFFER, f.texCoord),
        u.enableVertexAttribArray(h.aUV),
        u.vertexAttribPointer(h.aUV, 2, u.FLOAT, !1, 0, 0),
        u.enable(u.BLEND),
        u.blendFunc(u.SRC_ALPHA, u.ONE_MINUS_SRC_ALPHA),
        u.pixelStorei(u.UNPACK_FLIP_Y_WEBGL, !0),
        u.pixelStorei(u.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1),
        u.activeTexture(u.TEXTURE0),
        u.uniform1i(h.uTex, 0));
    const v: any = d();
    (u.uniform3fv(h.uBg, v.bg), u.uniform3fv(h.uFill, v.fill));
    const b: any = new Float32Array(16);
    b.fill(NaN);
    let S: any = null, w: any = 0, x: any = !1, P: any = [], E: any = 0, T: any = 0, q: any = e.offsetWidth;
    const k: any = manageObserver(new ResizeObserver((t?: any): any => {
        const o: any = t[0];
        if (!o)
            return;
        const i: any = Math.min(window.devicePixelRatio || 1, n), r: any = Math.round(o.contentRect.width * i), a: any = Math.round(o.contentRect.height * i);
        (e.width === r && e.height === a) ||
            ((e.width = r),
                (e.height = a),
                (E = r),
                (T = a),
                (q = o.contentRect.width),
                u.viewport(0, 0, r, a),
                u.uniform2f(h.uRes, r, a),
                b.fill(NaN),
                x && W());
    }));
    k.observe(e);
    const A: any = Math.min(window.devicePixelRatio || 1, n);
    ((E = Math.round(e.offsetWidth * A)),
        (T = Math.round(e.offsetHeight * A)),
        (e.width = E),
        (e.height = T),
        u.viewport(0, 0, E, T),
        u.uniform2f(h.uRes, E, T));
    const _: any = manageObserver(new IntersectionObserver((e?: any): any => {
        const t: any = x;
        if (((x = e[0].isIntersecting), t !== x)) {
            for (let e: any = 0; e < P.length; e++) {
                const t: any = P[e];
                "video" === t.type &&
                    (x
                        ? t.el.paused && t.el.play().catch((): any => { })
                        : t.el.paused || t.el.pause());
            }
            x ? B() : (S && cancelAnimationFrame(S), (S = null));
        }
    }, { threshold: 0.01, rootMargin: "20% 0px 20% 0px" }));
    _.observe(e);
    const O: any = (): any => {
        const e: any = u.createTexture();
        return (u.bindTexture(u.TEXTURE_2D, e),
            u.texParameteri(u.TEXTURE_2D, u.TEXTURE_WRAP_S, u.CLAMP_TO_EDGE),
            u.texParameteri(u.TEXTURE_2D, u.TEXTURE_WRAP_T, u.CLAMP_TO_EDGE),
            u.texParameteri(u.TEXTURE_2D, u.TEXTURE_MIN_FILTER, u.LINEAR),
            u.texParameteri(u.TEXTURE_2D, u.TEXTURE_MAG_FILTER, u.LINEAR),
            e);
    }, L: any = (e?: any): any => new Promise((t?: any): any => {
        const o: any = new Image();
        ((o.crossOrigin = "anonymous"), (o.decoding = "async"));
        let n: any = !1;
        ((o.onload = (): any => {
            const n: any = O();
            (u.texImage2D(u.TEXTURE_2D, 0, u.RGBA, u.RGBA, u.UNSIGNED_BYTE, o),
                t({
                    type: "image",
                    el: o,
                    tex: n,
                    config: e.config || {},
                    width: o.width,
                    height: o.height,
                }));
        }),
            (o.onerror = (): any => {
                if (!n)
                    return ((n = !0), (o.crossOrigin = null), void (o.src = e.src));
                t(null);
            }),
            (o.src = e.src));
    }), M: any = (): any => Promise.all(t.map((e?: any): any => ("image" === e.type ? L(e) : I(e)))).then((e?: any): any => e.filter(Boolean)), $: any = (e?: any, t?: any): any => {
        const o: any = [];
        if (Array.isArray(t.sources))
            o.push(...t.sources
                .filter((e?: any): any => e?.src)
                .map((e?: any): any => ({ src: e.src, type: e.type || "" })));
        else if (t.src) {
            const e: any = t.src.includes(".webm"), n: any = t.src.includes(".mp4") ? "video/mp4" : e ? "video/webm" : "";
            if (e) {
                const e: any = t.src.replace(/\.webm(\?.*)?$/i, ".mp4$1");
                e !== t.src && o.push({ src: e, type: "video/mp4" });
            }
            o.push({ src: t.src, type: n });
        }
        ((e.innerHTML = ""),
            o.forEach(({ src: t, type: o }: any): any => {
                const n: any = document.createElement("source");
                ((n.src = t), o && (n.type = o), e.appendChild(n));
            }));
    }, I: any = (e?: any): any => new Promise((t?: any): any => {
        const o: any = document.createElement("video");
        ((o.crossOrigin = "anonymous"),
            (o.muted = !0),
            (o.autoplay = !1),
            (o.loop = !1 !== e.loop),
            (o.playsInline = !0),
            (o.preload = "auto"),
            ["muted", "playsinline", "webkit-playsinline"].forEach((e?: any): any => o.setAttribute(e, "")),
            $(o, e));
        const n: any = O();
        let i: any = !1;
        const r: any = {
            type: "video",
            el: o,
            tex: n,
            config: e.config || {},
            isReady: (): any => i,
            width: 1920,
            height: 1080,
            lastVideoTime: -1,
        }, a: any = (): any => {
            !i &&
                o.readyState >= o.HAVE_CURRENT_DATA &&
                ((i = !0),
                    (r.width = o.videoWidth || 1920),
                    (r.height = o.videoHeight || 1080),
                    u.bindTexture(u.TEXTURE_2D, n),
                    u.texImage2D(u.TEXTURE_2D, 0, u.RGBA, u.RGBA, u.UNSIGNED_BYTE, o),
                    x && o.play().catch((): any => { }),
                    t(r));
        }, s: any = (): any => {
            i || ((i = !0), t(r));
        };
        (listen(o, "loadeddata", a), listen(o, "canplay", a), listen(o, "error", s),
            o.load(),
            setTimeout((): any => {
                i || ((i = !0), t(r));
            }, 5e3));
    }), C: any = (e?: any): any => {
        if (!e.isReady() || e.el.readyState < e.el.HAVE_CURRENT_DATA)
            return;
        const t: any = e.el.currentTime;
        if (t !== e.lastVideoTime) {
            e.lastVideoTime = t;
            try {
                u.texSubImage2D(u.TEXTURE_2D, 0, 0, 0, u.RGBA, u.UNSIGNED_BYTE, e.el);
            }
            catch (t: any) {
                try {
                    u.texImage2D(u.TEXTURE_2D, 0, u.RGBA, u.RGBA, u.UNSIGNED_BYTE, e.el);
                }
                catch (e: any) { }
            }
        }
    }, R: any = (e?: any): any => {
        const t: any = e.config;
        (u.bindTexture(u.TEXTURE_2D, e.tex), "video" === e.type && C(e));
        const o: any = "video" === e.type ? e.el.videoWidth || 1920 : e.width, n: any = "video" === e.type ? e.el.videoHeight || 1080 : e.height;
        (b[0] === o && b[1] === n) ||
            ((b[0] = o), (b[1] = n), u.uniform2f(h.uTexSize, o, n));
        const i: any = void 0 !== t.xSquares ? t.xSquares : a.xSquares, r: any = void 0 !== t.ySquares ? t.ySquares : a.ySquares;
        (b[2] === i && b[3] === r) ||
            ((b[2] = i), (b[3] = r), u.uniform2f(h.uGrid, i, r));
        const s: any = c(void 0 !== t.x ? t.x : a.x, E), l: any = c(void 0 !== t.y ? t.y : a.y, T), d: any = c(void 0 !== t.width ? t.width : a.width, E), g: any = c(void 0 !== t.height ? t.height : a.height, T), p: any = d / i, m: any = c(void 0 !== t.minSquareWidth ? t.minSquareWidth : a.minSquareWidth, p), y: any = c(void 0 !== t.maxSquareWidth ? t.maxSquareWidth : a.maxSquareWidth, p);
        (b[4] === m && b[5] === y) ||
            ((b[4] = m),
                (b[5] = y),
                u.uniform1f(h.uMinW, m),
                u.uniform1f(h.uMaxW, y));
        const f: any = void 0 !== t.threshold ? t.threshold : a.threshold, v: any = void 0 !== t.gamma ? t.gamma : a.gamma, S: any = void 0 !== t.blackPoint ? t.blackPoint : a.blackPoint, w: any = void 0 !== t.whitePoint ? t.whitePoint : a.whitePoint, x: any = void 0 !== t.bgOpacity ? t.bgOpacity : a.bgOpacity, P: any = void 0 !== t.fillOpacity ? t.fillOpacity : a.fillOpacity;
        (b[6] !== f && ((b[6] = f), u.uniform1f(h.uThr, f)),
            b[7] !== v && ((b[7] = v), u.uniform1f(h.uGam, v)),
            b[8] !== S && ((b[8] = S), u.uniform1f(h.uBP, S)),
            b[9] !== w && ((b[9] = w), u.uniform1f(h.uWP, w)),
            b[10] !== x && ((b[10] = x), u.uniform1f(h.uBgOpacity, x)),
            b[11] !== P && ((b[11] = P), u.uniform1f(h.uFillOpacity, P)));
        const q: any = T - l - g, k: any = s + d, A: any = q + g;
        ((b[12] === s && b[13] === q && b[14] === k && b[15] === A) ||
            ((b[12] = s),
                (b[13] = q),
                (b[14] = k),
                (b[15] = A),
                u.uniform4f(h.uBounds, s, q, k, A)),
            u.drawArrays(u.TRIANGLE_STRIP, 0, 4));
    }, W: any = (): any => {
        if (P.length && x) {
            (u.clearColor(0, 0, 0, 0), u.clear(u.COLOR_BUFFER_BIT), b.fill(NaN));
            for (let e: any = 0; e < P.length; e++) {
                const t: any = P[e];
                ("video" !== t.type || t.isReady()) && R(t, e);
            }
        }
    }, F: any = (e?: any): any => {
        (e - w >= r && ((w = e), x && W()), (S = requestAnimationFrame(F)));
    }, B: any = (): any => {
        (S && cancelAnimationFrame(S), (w = 0), (S = requestAnimationFrame(F)));
    };
    return {
        destroy: (): any => {
            (S && cancelAnimationFrame(S), k.disconnect(), _.disconnect());
            for (let e: any = 0; e < P.length; e++) {
                const t: any = P[e];
                (t.tex && u.deleteTexture(t.tex),
                    "video" === t.type &&
                        (t.el.pause(),
                            t.el.removeAttribute("src"),
                            (t.el.innerHTML = ""),
                            t.el.load()));
            }
            (u.deleteBuffer(f.position),
                u.deleteBuffer(f.texCoord),
                u.deleteProgram(m),
                (P = []));
        },
        loaded: M().then((e?: any): any => {
            ((P = e), B());
        }),
    };
}
