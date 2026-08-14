const revealItems=document.querySelectorAll('.reveal');
const reduceMotion=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if(!reduceMotion&&'IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(!entry.isIntersecting)return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  },{rootMargin:'0px 0px -10% 0px',threshold:.1});

  revealItems.forEach((item,index)=>{
    const explicitDelay=Number(item.dataset.delay||0);
    const sequenceDelay=item.closest('.hero')?Math.min(index,4)*85:Math.min(index%4,2)*60;
    item.style.transitionDelay=`${explicitDelay||sequenceDelay}ms`;
    observer.observe(item);
  });
}else{
  revealItems.forEach(item=>item.classList.add('is-visible'));
}

const header=document.querySelector('.site-header');
const navLinks=[...document.querySelectorAll('.nav-links a[href^="#"]')];
const sections=[...document.querySelectorAll('main section[id]')];
const pendingCaseLinks=document.querySelectorAll('.project-link[aria-disabled="true"]');
let ticking=false;

pendingCaseLinks.forEach(link=>link.addEventListener('click',event=>event.preventDefault()));

const updateScrollState=()=>{
  header.classList.toggle('is-scrolled',window.scrollY>24);
  const marker=window.scrollY+window.innerHeight*.32;
  let current='home';
  sections.forEach(section=>{if(section.offsetTop<=marker)current=section.id;});
  navLinks.forEach(link=>link.classList.toggle('is-active',link.getAttribute('href')===`#${current}`));
  ticking=false;
};

updateScrollState();
window.addEventListener('scroll',()=>{
  if(ticking)return;
  ticking=true;
  requestAnimationFrame(updateScrollState);
},{passive:true});
