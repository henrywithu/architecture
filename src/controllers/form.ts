import {listen} from '../core/Lifecycle';
import {gsapCore,runtime} from '../core/runtime';
export function initForm():void {
 document.querySelectorAll<HTMLInputElement>('.input_field').forEach(input=>{
  const label=input.parentElement?.querySelector('.input_label');
  listen(input,'focusin',()=>label?.classList.add('focused'));
  listen(input,'focusout',()=>{if(!input.value.trim())label?.classList.remove('focused');});
  if(input.type==='tel')listen(input,'input',()=>{input.value=input.value.replace(/[^\d+\-]/g,'');});
  if(input.name==='Name')listen(input,'input',()=>{input.value=input.value.replace(/[\d!@#$%^&*()_+=\[\]{};:'"\\|,.<>/?~`]/g,'');});
 });
 document.querySelectorAll<HTMLElement>('[data-form-btn]').forEach(button=>listen(button,'click',event=>{event.preventDefault();button.closest('form')?.requestSubmit();}));
 document.querySelectorAll<HTMLFormElement>('form').forEach(form=>{
  form.removeAttribute('action');form.method='post';
  listen(form,'submit',event=>{
   event.preventDefault();if(!form.reportValidity())return;
   const success=form.parentElement?.querySelector<HTMLElement>('.modal_cta-form_success');if(!success)return;
   try{sessionStorage.setItem('architecture-inquiry',JSON.stringify(Object.fromEntries(new FormData(form))));}catch{}
   const status=document.createElement('p');status.className='text-s';status.setAttribute('role','status');status.textContent='Preview: your request is saved on this device.';success.append(status);
   gsapCore.timeline().set([form,success],{display:'flex',position:'absolute',inset:'0% auto auto 0%',transformPerspective:1000}).set(form,{zIndex:1}).fromTo(form,{rotateY:0},{rotateY:-180,duration:runtime.durL,ease:'InOut'}).fromTo(success,{rotateY:180},{rotateY:0,duration:runtime.durL,ease:'InOut'},'<').set(success,{zIndex:2},'<50%');
  });
 });
}
