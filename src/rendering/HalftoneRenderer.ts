import vertexShader from "./shaders/halftone.vertex.glsl?raw";
import fragmentShader from "./shaders/halftone.fragment.glsl?raw";
import type { Scene } from "../core/scenes";

export type Length = number | `${number}%` | `${number}vw` | string;
export interface LayerConfig {
  x?: Length;
  y?: Length;
  width?: Length;
  height?: Length;
  xSquares?: number;
  ySquares?: number;
  minSquareWidth?: Length;
  maxSquareWidth?: Length;
  threshold?: number;
  gamma?: number;
  blackPoint?: number;
  whitePoint?: number;
  bgOpacity?: number;
  fillOpacity?: number;
  blur?: number;
  fps?: number;
}
export interface SceneLayer {
  type: "image" | "video";
  src?: string;
  sources?: { src: string; type?: string }[];
  config?: LayerConfig;
  loop?: boolean;
  skip?: boolean;
}
interface TextureLayer {
  type: "image" | "video";
  element: HTMLImageElement | HTMLVideoElement;
  texture: WebGLTexture;
  config: LayerConfig;
  width: number;
  height: number;
  lastTime: number;
}
const defaults: Required<LayerConfig> = {
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
};
const uniformNames = [
  "u_texture",
  "u_resolution",
  "u_texSize",
  "u_gridSize",
  "u_minWidth",
  "u_maxWidth",
  "u_threshold",
  "u_gamma",
  "u_blackPoint",
  "u_whitePoint",
  "u_bgColor",
  "u_fillColor",
  "u_bgOpacity",
  "u_fillOpacity",
  "u_bounds",
] as const;
type UniformName = (typeof uniformNames)[number];

/** Typed implementation of the reference's WebGL 1 luminance-to-line renderer.
 * The extracted GLSL, DPR cap, grid placement, levels and compositing are exact. */
export class HalftoneRenderer implements Scene {
  readonly loaded: Promise<void>;
  private readonly gl: WebGLRenderingContext;
  private readonly program: WebGLProgram;
  private readonly uniforms: Record<UniformName, WebGLUniformLocation | null>;
  private readonly buffers: WebGLBuffer[] = [];
  private readonly textures: Set<WebGLTexture> = new Set();
  private layers: TextureLayer[] = [];
  private readonly videos: Set<HTMLVideoElement> = new Set();
  private readonly resizeObserver: ResizeObserver;
  private readonly visibilityObserver: IntersectionObserver;
  private readonly cache = new Float32Array(16).fill(NaN);
  private frame: number | null = null;
  private visible = false;
  private disposed = false;
  private width = 0;
  private height = 0;
  private cssWidth = 0;
  private lastFrame = 0;
  private readonly options: Required<LayerConfig>;

  constructor(
    private readonly canvas: HTMLCanvasElement,
    sources: SceneLayer[],
    options: LayerConfig = {},
  ) {
    this.options = { ...defaults, ...options };
    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      premultipliedAlpha: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });
    if (!gl) throw new Error("WebGL is unavailable");
    this.gl = gl;
    this.program = this.compileProgram(vertexShader, fragmentShader);
    this.uniforms = Object.fromEntries(
      uniformNames.map((name) => [
        name,
        gl.getUniformLocation(this.program, name),
      ]),
    ) as Record<UniformName, WebGLUniformLocation | null>;
    gl.useProgram(this.program);
    this.bindAttribute(
      "a_position",
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
    );
    this.bindAttribute(
      "a_texCoord",
      new Float32Array([0, 1, 1, 1, 0, 0, 1, 0]),
    );
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(this.uniforms.u_texture, 0);
    const style = getComputedStyle(document.documentElement);
    gl.uniform3fv(
      this.uniforms.u_bgColor,
      this.color(
        style.getPropertyValue("--_colors---base-0--100").trim() || "#000000",
      ),
    );
    gl.uniform3fv(
      this.uniforms.u_fillColor,
      this.color(
        style.getPropertyValue("--_colors---base-1000--100").trim() ||
          "#ffffff",
      ),
    );
    this.resize(canvas.offsetWidth, canvas.offsetHeight);
    this.resizeObserver = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) this.resize(rect.width, rect.height);
    });
    this.resizeObserver.observe(canvas);
    this.visibilityObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries[0]?.isIntersecting ?? false;
        if (visible === this.visible) return;
        this.visible = visible;
        this.videos.forEach((video) => {
          if (visible) void video.play().catch(() => {});
          else video.pause();
        });
        if (visible) this.start();
        else this.stop();
      },
      { threshold: 0.01, rootMargin: "20% 0px 20% 0px" },
    );
    this.visibilityObserver.observe(canvas);
    this.loaded = Promise.all(
      sources.map((source) =>
        source.type === "image"
          ? this.loadImage(source)
          : this.loadVideo(source),
      ),
    ).then((layers) => {
      if (this.disposed) return;
      this.layers = layers.filter(
        (layer): layer is TextureLayer => layer !== null,
      );
      if (this.visible) this.start();
    });
  }
  private color(hex: string): Float32Array {
    let value = hex.replace("#", "").trim();
    if (value.length === 3) value = [...value].map((c) => c + c).join("");
    return new Float32Array(
      [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16) / 255),
    );
  }
  private compileProgram(vertex: string, fragment: string): WebGLProgram {
    const gl = this.gl;
    const shaders = [
      { kind: gl.VERTEX_SHADER, source: vertex },
      { kind: gl.FRAGMENT_SHADER, source: fragment },
    ].map(({ kind, source }) => {
      const shader = gl.createShader(kind)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS))
        throw new Error(
          gl.getShaderInfoLog(shader) || "Shader compilation failed",
        );
      return shader;
    });
    const program = gl.createProgram()!;
    shaders.forEach((shader) => gl.attachShader(program, shader));
    gl.linkProgram(program);
    shaders.forEach((shader) => gl.deleteShader(shader));
    if (!gl.getProgramParameter(program, gl.LINK_STATUS))
      throw new Error(gl.getProgramInfoLog(program) || "Shader link failed");
    return program;
  }
  private bindAttribute(name: string, data: Float32Array): void {
    const gl = this.gl,
      buffer = gl.createBuffer()!;
    this.buffers.push(buffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    const location = gl.getAttribLocation(this.program, name);
    gl.enableVertexAttribArray(location);
    gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
  }
  private resize(cssWidth: number, cssHeight: number): void {
    if (this.disposed) return;
    const dpr = Math.min(devicePixelRatio || 1, 1.5),
      width = Math.round(cssWidth * dpr),
      height = Math.round(cssHeight * dpr);
    this.cssWidth = cssWidth;
    if (this.width === width && this.height === height) return;
    this.width = width;
    this.height = height;
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
    this.gl.uniform2f(this.uniforms.u_resolution, width, height);
    this.cache.fill(NaN);
    if (this.visible) this.draw();
  }
  private texture(): WebGLTexture {
    const gl = this.gl,
      texture = gl.createTexture()!;
    this.textures.add(texture);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    return texture;
  }
  private loadImage(source: SceneLayer): Promise<TextureLayer | null> {
    return new Promise((resolve) => {
      const image = new Image();
      image.crossOrigin = "anonymous";
      image.decoding = "async";
      let retried = false;
      image.onload = () => {
        if (this.disposed) {
          resolve(null);
          return;
        }
        const texture = this.texture();
        this.gl.texImage2D(
          this.gl.TEXTURE_2D,
          0,
          this.gl.RGBA,
          this.gl.RGBA,
          this.gl.UNSIGNED_BYTE,
          image,
        );
        resolve({
          type: "image",
          element: image,
          texture,
          config: source.config || {},
          width: image.width,
          height: image.height,
          lastTime: -1,
        });
      };
      image.onerror = () => {
        if (!retried) {
          retried = true;
          image.removeAttribute("crossorigin");
          image.src = source.src || "";
        } else resolve(null);
      };
      image.src = source.src || "";
    });
  }
  private loadVideo(source: SceneLayer): Promise<TextureLayer | null> {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      this.videos.add(video);
      video.crossOrigin = "anonymous";
      video.muted = true;
      video.autoplay = false;
      video.loop = source.loop !== false;
      video.playsInline = true;
      video.preload = "auto";
      ["muted", "playsinline", "webkit-playsinline"].forEach((attr) =>
        video.setAttribute(attr, ""),
      );
      const sources =
        source.sources ??
        (source.src
          ? [
              {
                src: source.src,
                type: source.src.includes(".mp4") ? "video/mp4" : "video/webm",
              },
            ]
          : []);
      sources.forEach(({ src, type }) => {
        const node = document.createElement("source");
        node.src = src;
        if (type) node.type = type;
        video.append(node);
      });
      const texture = this.texture();
      let finished = false;
      const layer: TextureLayer = {
        type: "video",
        element: video,
        texture,
        config: source.config || {},
        width: 1920,
        height: 1080,
        lastTime: -1,
      };
      const finish = (ready: boolean) => {
        if (finished) return;
        finished = true;
        clearTimeout(timeout);
        video.removeEventListener("loadeddata", onReady);
        video.removeEventListener("canplay", onReady);
        video.removeEventListener("error", onError);
        if (this.disposed) {
          resolve(null);
          return;
        }
        if (ready) {
          layer.width = video.videoWidth || 1920;
          layer.height = video.videoHeight || 1080;
          this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
          this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.RGBA,
            this.gl.RGBA,
            this.gl.UNSIGNED_BYTE,
            video,
          );
          if (this.visible) void video.play().catch(() => {});
        }
        resolve(layer);
      };
      const onReady = () => {
          if (video.readyState >= video.HAVE_CURRENT_DATA) finish(true);
        },
        onError = () => finish(false);
      const timeout = setTimeout(() => finish(false), 5000);
      video.addEventListener("loadeddata", onReady);
      video.addEventListener("canplay", onReady);
      video.addEventListener("error", onError);
      video.load();
    });
  }
  private length(value: Length, total: number): number {
    if (typeof value === "number") return value;
    if (value.endsWith("%")) return (parseFloat(value) / 100) * total;
    if (value.endsWith("vw"))
      return (
        (parseFloat(value) / 100) *
        this.cssWidth *
        Math.min(devicePixelRatio || 1, 1.5)
      );
    return parseFloat(value);
  }
  private uniform(index: number, name: UniformName, value: number): void {
    if (this.cache[index] === value) return;
    this.cache[index] = value;
    this.gl.uniform1f(this.uniforms[name], value);
  }
  private renderLayer(layer: TextureLayer): void {
    const gl = this.gl,
      config = { ...this.options, ...layer.config };
    gl.bindTexture(gl.TEXTURE_2D, layer.texture);
    let width = layer.width,
      height = layer.height;
    if (layer.type === "video") {
      const video = layer.element as HTMLVideoElement;
      if (video.readyState < video.HAVE_CURRENT_DATA) return;
      width = video.videoWidth || 1920;
      height = video.videoHeight || 1080;
      if (video.currentTime !== layer.lastTime) {
        layer.lastTime = video.currentTime;
        try {
          gl.texSubImage2D(
            gl.TEXTURE_2D,
            0,
            0,
            0,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            video,
          );
        } catch {
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            video,
          );
        }
      }
    }
    if (this.cache[0] !== width || this.cache[1] !== height) {
      this.cache[0] = width;
      this.cache[1] = height;
      gl.uniform2f(this.uniforms.u_texSize, width, height);
    }
    if (
      this.cache[2] !== config.xSquares ||
      this.cache[3] !== config.ySquares
    ) {
      this.cache[2] = config.xSquares;
      this.cache[3] = config.ySquares;
      gl.uniform2f(this.uniforms.u_gridSize, config.xSquares, config.ySquares);
    }
    const x = this.length(config.x, this.width),
      y = this.length(config.y, this.height),
      w = this.length(config.width, this.width),
      h = this.length(config.height, this.height),
      cell = w / config.xSquares;
    this.uniform(4, "u_minWidth", this.length(config.minSquareWidth, cell));
    this.uniform(5, "u_maxWidth", this.length(config.maxSquareWidth, cell));
    this.uniform(6, "u_threshold", config.threshold);
    this.uniform(7, "u_gamma", config.gamma);
    this.uniform(8, "u_blackPoint", config.blackPoint);
    this.uniform(9, "u_whitePoint", config.whitePoint);
    this.uniform(10, "u_bgOpacity", config.bgOpacity);
    this.uniform(11, "u_fillOpacity", config.fillOpacity);
    const bottom = this.height - y - h,
      right = x + w,
      top = bottom + h;
    if (
      this.cache[12] !== x ||
      this.cache[13] !== bottom ||
      this.cache[14] !== right ||
      this.cache[15] !== top
    ) {
      this.cache[12] = x;
      this.cache[13] = bottom;
      this.cache[14] = right;
      this.cache[15] = top;
      gl.uniform4f(this.uniforms.u_bounds, x, bottom, right, top);
    }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  private draw(): void {
    if (this.disposed || !this.visible || !this.layers.length) return;
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.cache.fill(NaN);
    this.layers.forEach((layer) => this.renderLayer(layer));
  }
  private tick = (time: number): void => {
    if (this.disposed || !this.visible) return;
    if (time - this.lastFrame >= 1000 / this.options.fps) {
      this.lastFrame = time;
      this.draw();
    }
    this.frame = requestAnimationFrame(this.tick);
  };
  private start(): void {
    this.stop();
    this.lastFrame = 0;
    this.frame = requestAnimationFrame(this.tick);
  }
  private stop(): void {
    if (this.frame !== null) cancelAnimationFrame(this.frame);
    this.frame = null;
  }
  destroy(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.stop();
    this.resizeObserver.disconnect();
    this.visibilityObserver.disconnect();
    this.videos.forEach((video) => {
      video.pause();
      video.removeAttribute("src");
      video.replaceChildren();
      video.load();
    });
    this.textures.forEach((texture) => this.gl.deleteTexture(texture));
    this.buffers.forEach((buffer) => this.gl.deleteBuffer(buffer));
    this.gl.deleteProgram(this.program);
    this.gl.getExtension("WEBGL_lose_context")?.loseContext();
    this.layers = [];
    this.videos.clear();
    this.textures.clear();
  }
}
export function initCanvasEffect(
  target: string | HTMLCanvasElement,
  layers: SceneLayer[],
  options: LayerConfig = {},
): Scene | undefined {
  const canvases =
    typeof target === "string"
      ? Array.from(document.querySelectorAll<HTMLCanvasElement>(target))
      : [target];
  const scenes = canvases
    .filter(Boolean)
    .map((canvas) => {
      try {
        return new HalftoneRenderer(canvas, layers, options);
      } catch (error) {
        console.warn("Scene could not initialize", error);
        return null;
      }
    })
    .filter((scene): scene is HalftoneRenderer => scene !== null);
  if (!scenes.length) return;
  return {
    destroy: () => scenes.forEach((scene) => scene.destroy()),
    loaded: Promise.all(scenes.map((scene) => scene.loaded)),
  };
}
