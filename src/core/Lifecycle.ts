import { gsap as gsapCore } from "gsap";
/** Own every DOM listener and observer so route changes and HMR cannot duplicate them. */
export class Lifecycle {
  private cleanups: (() => void)[] = [];
  private controller = new AbortController();
  private animationContext = gsapCore.context(() => {});
  readonly signal = this.controller.signal;
  add(cleanup: () => void): void {
    if (this.signal.aborted) cleanup();
    else this.cleanups.push(cleanup);
  }
  run<T>(callback: () => T): T {
    if (gsapCore.context()) return callback();
    let value!: T;
    this.animationContext.add(() => {
      value = callback();
    });
    return value;
  }
  dispose(): void {
    this.controller.abort();
    this.cleanups
      .splice(0)
      .reverse()
      .forEach((cleanup) => cleanup());
    this.animationContext.revert();
  }
}
let active: Lifecycle | undefined;
export function useLifecycle(scope: Lifecycle): void {
  active = scope;
}
export function listen(
  target: EventTarget | null,
  type: string,
  listener: EventListener,
  options?: boolean | AddEventListenerOptions,
): void {
  if (!target) return;
  const config = typeof options === "boolean" ? { capture: options } : options;
  const scope = active;
  const wrapped: EventListener = (event) => {
    if (scope && !scope.signal.aborted)
      scope.run(() => listener.call(target, event));
    else if (!scope) listener.call(target, event);
  };
  target.addEventListener(type, wrapped, { ...config, signal: scope?.signal });
}
export function manageObserver<T extends { disconnect(): void }>(
  observer: T,
): T {
  active?.add(() => observer.disconnect());
  return observer;
}
export function cleanup(action: () => void): void {
  active?.add(action);
}
export function managedInterval(
  callback: () => void,
  delay: number,
): ReturnType<typeof setInterval> {
  const timer = setInterval(callback, delay);
  active?.add(() => clearInterval(timer));
  return timer;
}
export function managedTimeout(
  callback: () => void,
  delay: number,
): ReturnType<typeof setTimeout> {
  const timer = setTimeout(callback, delay);
  active?.add(() => clearTimeout(timer));
  return timer;
}
export function matchMedia(conditions: Record<string, () => unknown>): void {
  const scope = active;
  const media = gsapCore.matchMedia();
  Object.entries(conditions).forEach(([query, callback]) =>
    media.add(query, callback),
  );
  scope?.add(() => media.revert());
}

export function runWithLifecycle<T>(callback: () => T): T {
  return active ? active.run(callback) : callback();
}

export function lifecycleSignal(): AbortSignal | undefined {
  return active?.signal;
}
