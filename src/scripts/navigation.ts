import pubSub from './modules/pubSub';

function Naviagtion(nav: HTMLElement) {
  const resiveObserve = new ResizeObserver(resizeCallback);
  const navButton = nav.querySelector('[data-nav-button]') as HTMLButtonElement;
  const navList = nav.querySelector('[data-nav-list]') as HTMLUListElement;
  const navSub = nav.querySelector('[data-sub-nav]') as HTMLUListElement;
  const navShopItem = nav.querySelector('[data-nav-item="Shop"]') as HTMLAnchorElement;

  function toggleSubNav(event: TouchEvent) {
    const target = event.target as HTMLAnchorElement;
    const isExpanded: boolean = target.getAttribute('aria-expanded') === 'true';
    const navListHeight = navList.scrollHeight;
    const navSubHeight = navSub.scrollHeight;
    const position = isExpanded ? navListHeight - navSubHeight : navListHeight + navSubHeight;

    event.preventDefault();

    target.setAttribute('aria-expanded', `${!isExpanded}`);
    pubSub.publish('nav/visibility/changed', position + 1);

    if (window.outerWidth >= 768) return;

    navSub.style.height = `${isExpanded ? '0' : navSubHeight}px`;
  }

  function resizeCallback(entries: Array<ResizeObserverEntry>) {
    entries.forEach(entry => {
      const width = entry.contentRect.width;

      if ('ontouchstart' in document.documentElement) {
        navShopItem.setAttribute('aria-expanded', 'false');
        navShopItem.addEventListener('touchend', toggleSubNav);
      } else {
        navShopItem.removeAttribute('aria-expanded');
        navShopItem.removeEventListener('touchend', toggleSubNav);
      }

      if (width >= 768) {
        navSub.removeAttribute('style');
        navList.classList.remove('-translate-y-full');
      }
    });
  }

  function closeNav(button: HTMLButtonElement) {
    button.setAttribute('aria-expanded', 'false');
    navList.classList.add('-translate-y-full');
    pubSub.publish('nav/visibility/changed', 0);
  }

  function openNav(button: HTMLButtonElement) {
    button.setAttribute('aria-expanded', 'true');
    navList.classList.remove('-translate-y-full');
    pubSub.publish('nav/visibility/changed', navList.scrollHeight + 1);
  }

  function handleClickEvent(event: Event) {
    const target = event.target as HTMLButtonElement;
    const isExpanded: boolean = target.getAttribute('aria-expanded') === 'true';

    isExpanded ? closeNav(target) : openNav(target);
  }

  function init() {
    navButton.addEventListener('click', handleClickEvent);
    resiveObserve.observe(document.body);
  }

  return {
    init
  }
}

export default Naviagtion;
