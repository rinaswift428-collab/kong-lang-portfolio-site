const revealItems = document.querySelectorAll('.reveal');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (reduceMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach((item) => item.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });

  revealItems.forEach((item) => revealObserver.observe(item));
}

const progressBar = document.querySelector('.page-progress span');
const updateProgress = () => {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
  progressBar.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`;
};

window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

const sectionLinks = [...document.querySelectorAll('.case-subnav a')];
const sectionNav = document.querySelector('.case-subnav');
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);

let activeSectionLink = sectionLinks.find((link) => link.classList.contains('is-active')) || null;

const keepSectionLinkVisible = (link) => {
  if (!sectionNav || !link || sectionNav.scrollWidth <= sectionNav.clientWidth) return;

  const navRect = sectionNav.getBoundingClientRect();
  const linkRect = link.getBoundingClientRect();
  const centeredLeft = sectionNav.scrollLeft
    + linkRect.left
    - navRect.left
    - (sectionNav.clientWidth - linkRect.width) / 2;
  const maxLeft = sectionNav.scrollWidth - sectionNav.clientWidth;

  sectionNav.scrollTo({
    left: Math.min(maxLeft, Math.max(0, centeredLeft)),
    behavior: reduceMotion ? 'auto' : 'smooth',
  });
};

const activateSectionLink = (sectionId) => {
  const nextLink = sectionLinks.find((link) => link.getAttribute('href') === `#${sectionId}`);
  if (!nextLink || nextLink === activeSectionLink) return;

  sectionLinks.forEach((link) => link.classList.toggle('is-active', link === nextLink));
  activeSectionLink = nextLink;
  window.requestAnimationFrame(() => keepSectionLinkVisible(nextLink));
};

if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;
    activateSectionLink(visible.target.id);
  }, { rootMargin: '-26% 0px -58% 0px', threshold: [0, 0.1, 0.4] });

  sections.forEach((section) => sectionObserver.observe(section));
}
