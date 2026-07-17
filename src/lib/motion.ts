// 全站动效引擎：滚动入场、逐行标题、光斑卡片、磁性按钮、导航隐现、数字计数
// 原生实现，无第三方依赖；与 Astro View Transitions 兼容（每次 astro:page-load 重新初始化）

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let revealObserver: IntersectionObserver | null = null;

/** 滚动入场：data-reveal / data-reveal-lines 进入视口后加 .is-visible */
function initReveal() {
  revealObserver?.disconnect();

  const targets = document.querySelectorAll<HTMLElement>(
    '[data-reveal]:not(.is-visible), [data-reveal-lines]:not(.is-visible)'
  );
  if (targets.length === 0) return;

  // 入场完成后移除 data-reveal，避免其过渡与延迟覆盖元素自身的 hover 过渡
  const finalize = (el: Element) => {
    if (el.hasAttribute('data-reveal')) el.removeAttribute('data-reveal');
  };

  if (prefersReducedMotion()) {
    targets.forEach((el) => {
      el.classList.add('is-visible');
      finalize(el);
    });
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          el.classList.add('is-visible');
          el.addEventListener(
            'transitionend',
            (e) => {
              if (e.target === el) finalize(el);
            },
            { once: true }
          );
          // 兜底：transitionend 偶发不触发时也要恢复
          setTimeout(() => finalize(el), 2400);
          observer.unobserve(el);
        }
      }
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  targets.forEach((el) => revealObserver!.observe(el));
}

/** 光斑跟随：文档级事件委托，动态注入的卡片同样生效 */
let spotlightBound = false;
function initSpotlight() {
  if (spotlightBound) return;
  spotlightBound = true;
  document.addEventListener(
    'pointermove',
    (e) => {
      const el = (e.target as Element | null)?.closest?.<HTMLElement>('[data-spotlight]');
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
      el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
    },
    { passive: true }
  );
}

/** 磁性按钮：指针靠近时轻微吸附位移 */
function initMagnetic() {
  if (prefersReducedMotion() || !window.matchMedia('(pointer: fine)').matches) return;

  document.querySelectorAll<HTMLElement>('[data-magnetic]').forEach((el) => {
    if (el.dataset.magneticBound) return;
    el.dataset.magneticBound = '1';

    el.addEventListener('pointermove', (e) => {
      const rect = el.getBoundingClientRect();
      const dx = e.clientX - (rect.left + rect.width / 2);
      const dy = e.clientY - (rect.top + rect.height / 2);
      el.style.transform = `translate(${dx * 0.18}px, ${dy * 0.22}px)`;
    });

    el.addEventListener('pointerleave', () => {
      el.style.transform = '';
    });
  });
}

/** 导航栏：下滑隐藏、上滑出现，滚动后加投影 */
function initHeader() {
  const header = document.getElementById('main-header');
  if (!header || header.dataset.scrollBound) return;
  header.dataset.scrollBound = '1';

  let lastY = window.scrollY;
  let ticking = false;

  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('header-scrolled', y > 8);
    if (y > 120 && y > lastY) {
      header.classList.add('header-hidden');
    } else {
      header.classList.remove('header-hidden');
    }
    lastY = y;
    ticking = false;
  };

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    },
    { passive: true }
  );
}

/** 数字计数：data-count-to 进入视口后从 0 滚动到目标值 */
function initCounters() {
  const els = document.querySelectorAll<HTMLElement>('[data-count-to]:not([data-counted])');
  if (els.length === 0) return;

  const animate = (el: HTMLElement) => {
    el.dataset.counted = '1';
    const target = parseFloat(el.dataset.countTo || '0');
    const suffix = el.dataset.countSuffix || '';
    const decimals = (el.dataset.countTo || '').includes('.') ? 1 : 0;

    if (prefersReducedMotion()) {
      el.textContent = target.toFixed(decimals) + suffix;
      return;
    }

    const duration = 1400;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      // easeOutExpo
      const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          animate(entry.target as HTMLElement);
          obs.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.4 }
  );

  els.forEach((el) => observer.observe(el));
}

export function initMotion() {
  initReveal();
  initSpotlight();
  initMagnetic();
  initHeader();
  initCounters();
}
