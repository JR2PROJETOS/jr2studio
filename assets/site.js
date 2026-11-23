(function(){
var y=document.getElementById('year');if(y)y.textContent=new Date().getFullYear();
var menu=document.getElementById('menu'),nav=document.getElementById('navlinks');
if(menu&&nav){
 menu.addEventListener('click',function(){var o=nav.classList.toggle('open');menu.setAttribute('aria-expanded',o);menu.innerHTML=o?'&#10005;':'&#9776;'});
 nav.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.innerHTML='&#9776;'})});
}
var imgs=[].slice.call(document.querySelectorAll('img.zoom'));
var lb=document.getElementById('lb');if(!lb||!imgs.length)return;
var li=document.getElementById('lbi'),lc=document.getElementById('lbc'),cur=0;
function big(u){return u.replace('/img/','/img/large/')}
function show(i){
 cur=(i+imgs.length)%imgs.length;var im=imgs[cur];
 li.src=im.src;li.alt=im.alt;
 var want=cur,L=big(im.src);
 if(L!==im.src){var pre=new Image();pre.onload=function(){if(want===cur&&lb.classList.contains('open')){li.src=L}};pre.src=L}
 var f=im.closest('figure'),c=f&&f.querySelector('figcaption');
 lc.textContent=(c?c.textContent:im.alt)+'  ('+(cur+1)+'/'+imgs.length+')';
 lb.classList.add('open');document.body.style.overflow='hidden';
}
function hide(){lb.classList.remove('open');document.body.style.overflow='';li.src=''}
imgs.forEach(function(im,i){im.classList.add('zoom');im.setAttribute('tabindex','0');im.addEventListener('click',function(){show(i)});im.addEventListener('keydown',function(e){if(e.key==='Enter')show(i)})});
document.getElementById('lbx').onclick=hide;
document.getElementById('lbp').onclick=function(e){e.stopPropagation();show(cur-1)};
document.getElementById('lbn').onclick=function(e){e.stopPropagation();show(cur+1)};
lb.addEventListener('click',function(e){if(e.target===lb)hide()});
document.addEventListener('keydown',function(e){if(!lb.classList.contains('open'))return;if(e.key==='Escape')hide();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
var sx=0;lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
lb.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-sx;if(Math.abs(dx)>50)show(cur+(dx<0?1:-1))});
})();
(function(){
var f=document.getElementById('inquiry');if(!f)return;
f.addEventListener('submit',function(e){
 e.preventDefault();
 var g=function(n){var el=f.elements[n];return el?String(el.value||'').trim():''};
 var body=['Name: '+g('name'),'Email: '+g('email'),'Service: '+g('service'),'Target deadline: '+(g('timeline')||'not defined'),'','Project scope:',g('details')].join('\n');
 var subject=(f.getAttribute('data-subject')||'Project inquiry')+' - '+g('service');
 window.location.href='mailto:'+f.getAttribute('data-email')+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
});
})();
(function(){
var h=document.querySelector('header');
function sc(){if(h)h.classList.toggle('scrolled',window.scrollY>12)}
window.addEventListener('scroll',sc,{passive:true});sc();
var reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!('IntersectionObserver' in window)||reduce)return;
var sel='.eyebrow,section h2,.intro,.card,.proj,.step,.gal figure,.sheet,.pair>div,.trio>div,.hero-shot,.metric,.checks li,.aboutgrid>*,.contact>*,.prj h3,.prj .sub,.notice,.proof-layout>*';
var els=[].slice.call(document.querySelectorAll(sel)).filter(function(e){
 return !e.closest('.rhero')&&!e.closest('.hero')&&!e.closest('header')&&!e.closest('.lb')&&!e.parentElement.closest('.reveal-skip');
});
var seen=new Map();
els.forEach(function(e){
 var p=e.parentElement,i=seen.get(p)||0;seen.set(p,i+1);
 e.classList.add('reveal');e.style.setProperty('--d',((i%4)*0.09).toFixed(2)+'s');
});
function show(t){
 if(t.classList.contains('in'))return;
 t.classList.add('in');io.unobserve(t);
 setTimeout(function(){t.classList.remove('reveal','in');t.style.removeProperty('--d')},1300);
}
var io=new IntersectionObserver(function(en){
 en.forEach(function(x){if(x.isIntersecting)show(x.target)});
},{threshold:0.12,rootMargin:'0px 0px -6% 0px'});
els.forEach(function(e){io.observe(e)});
var tmr=null;
function sweep(){
 els.forEach(function(e){
  if(e.classList.contains('reveal')&&!e.classList.contains('in')){
   var r=e.getBoundingClientRect();
   if(r.top<window.innerHeight*0.94&&r.bottom>0)show(e);
  }
 });
}
window.addEventListener('scroll',function(){clearTimeout(tmr);tmr=setTimeout(sweep,140)},{passive:true});
window.addEventListener('resize',sweep);
setTimeout(sweep,600);
})();
