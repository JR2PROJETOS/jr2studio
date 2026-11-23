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
