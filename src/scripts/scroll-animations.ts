/**
 * ORBITAL — GSAP Scroll Animations
 * Reusable scroll-triggered reveal animations.
 */

export async function initScrollAnimations(): Promise<void> {
  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Show all elements immediately
    document.querySelectorAll('.reveal, [data-animate]').forEach((el) => {
      (el as HTMLElement).style.opacity = '1';
      (el as HTMLElement).style.transform = 'none';
    });
    return;
  }

  const { gsap } = await import('gsap');
  const { ScrollTrigger } = await import('gsap/ScrollTrigger');
  gsap.registerPlugin(ScrollTrigger);

  // Reveal elements
  const reveals = document.querySelectorAll('[data-animate]');
  reveals.forEach((el) => {
    const direction = el.getAttribute('data-animate') || 'up';
    const delay = parseFloat(el.getAttribute('data-delay') || '0');
    const stagger = parseFloat(el.getAttribute('data-stagger') || '0');

    let fromVars: gsap.TweenVars = { opacity: 0, duration: 0.8, ease: 'power2.out', delay };

    switch (direction) {
      case 'up':
        fromVars.y = 40;
        break;
      case 'down':
        fromVars.y = -40;
        break;
      case 'left':
        fromVars.x = -40;
        break;
      case 'right':
        fromVars.x = 40;
        break;
      case 'scale':
        fromVars.scale = 0.9;
        break;
      case 'fade':
        break;
    }

    gsap.from(el, {
      ...fromVars,
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
      },
    });
  });

  // Stagger groups
  const staggerGroups = document.querySelectorAll('[data-stagger-group]');
  staggerGroups.forEach((group) => {
    const children = group.querySelectorAll('[data-stagger-item]');
    if (children.length === 0) return;

    gsap.from(children, {
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: group,
        start: 'top 85%',
        once: true,
      },
    });
  });
}
