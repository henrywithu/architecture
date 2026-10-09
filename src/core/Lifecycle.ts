/** Own every DOM listener and observer so route changes and HMR cannot duplicate them. */
export class Lifecycle {
  private cleanups: (() => void)[] = [];
  private controller = new AbortController();
  readonly signal=this.controller.signal;
  add(cleanup:()=>void):void { if(this.signal.aborted) cleanup(); else this.cleanups.push(cleanup); }
  dispose():void {this.controller.abort();this.cleanups.splice(0).reverse().forEach(cleanup=>cleanup());}
}
let active: Lifecycle | undefined;
export function useLifecycle(scope:Lifecycle):void {active=scope;}
export function listen(target:EventTarget|null,type:string,listener:EventListener,options?:boolean|AddEventListenerOptions):void {
  if(!target)return;
  const config=typeof options==='boolean'?{capture:options}:options;
  target.addEventListener(type,listener,{...config,signal:active?.signal});
}
export function manageObserver<T extends {disconnect():void}>(observer:T):T {active?.add(()=>observer.disconnect());return observer;}
export function cleanup(action:()=>void):void {active?.add(action);}
