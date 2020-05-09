import pubSub from './modules/pubSub';

function Naviagtion(nav: HTMLElement) {
  const resiveObserve = new ResizeObserver(resizeCallback);
  const navButton = nav.querySelector('[data-nav-button]') as HTMLButtonElement;
  const navList = nav.querySelector('[data-nav-list]') as HTMLUListElement;
  const navShopItem = nav.querySelector('[data-nav-item="Shop"]') as HTMLAnchorElement;

  function toggleSubNav(event: TouchEvent) {
    const target = event.target as HTMLAnchorElement;
    const isExpanded: boolean = target.getAttribute('aria-expanded') === 'true';

    event.preventDefault();
    target.setAttribute('aria-expanded', `${!isExpanded}`);
  }

  function resizeCallback(entries: Array<ResizeObserverEntry>) {
    entries.forEach(entry => {
      const width = entry.contentRect.width;
      const navListHasStyleAttribute = navList.hasAttribute('style');

      if (width >= 768 && 'ontouchstart' in document.documentElement) {
        navShopItem.setAttribute('aria-expanded', 'false');
        navShopItem.addEventListener('touchend', toggleSubNav);
      } else {
        navShopItem.removeAttribute('aria-expanded');
        navShopItem.removeEventListener('touchend', toggleSubNav);
      }

      if (width >= 768 && navListHasStyleAttribute) {
        navList.removeAttribute('style');
        resiveObserve.unobserve(document.body);
      } else {
        resiveObserve.observe(document.body);
      }
    });
  }

  function closeNav(button: HTMLButtonElement) {
    button.setAttribute('aria-expanded', 'false');
    navList.style.height = '0px';
    pubSub.publish('nav/visibility/changed', 0);
  }

  function openNav(button: HTMLButtonElement) {
    button.setAttribute('aria-expanded', 'true');
    navList.style.height = `${navList.scrollHeight}px`;
    pubSub.publish('nav/visibility/changed', navList.scrollHeight);
  }

  function handleClickEvent(event: Event) {
    const target = event.target as HTMLButtonElement;
    const isExpanded: boolean = target.getAttribute('aria-expanded') === 'true';

    isExpanded ? closeNav(target) : openNav(target);
  }

  function init () {
    navButton.addEventListener('click', handleClickEvent);
    resiveObserve.observe(document.body);
  }

  return {
    init
  }
}

export default Naviagtion;
