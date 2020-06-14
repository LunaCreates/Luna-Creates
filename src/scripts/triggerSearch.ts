import pubSub from './modules/pubSub.ts';

function TriggerSearch(element: HTMLElement) {
  const triggerSearch = element.querySelector('[data-trigger-search]') as HTMLButtonElement;
  const searchBar = element.querySelector('[data-search-form]') as HTMLElement;
  const searchInput = element.querySelector('[data-search-input]') as HTMLInputElement;

  function showSearchBar(button: HTMLButtonElement) {
    document.body.classList.add('body--search-open');
    button.setAttribute('aria-expanded', 'true');
    searchBar.classList.add('search--open');
  }

  function closeSearchBar(button: HTMLButtonElement) {
    document.body.classList.remove('body--search-open');
    button.setAttribute('aria-expanded', 'false');
    searchBar.classList.remove('search--open');
  }

  function toggleSearchBar(event: Event) {
    const target = event.target as HTMLButtonElement;
    const isExpanded = target.getAttribute('aria-expanded') === 'true';

    isExpanded ? closeSearchBar(target) : showSearchBar(target);
  }

  function handleBlurEvent(event: Event) {
    const target = event.target as HTMLInputElement;

    if (target.value.length > 0) return;

    closeSearchBar(triggerSearch);
  }

  function positionSearchForm(height: Number) {
    searchBar.style.top = `calc(100% + ${height}px)`;
  }

  function init() {
    triggerSearch.addEventListener('click', toggleSearchBar);
    searchInput.addEventListener('blur', handleBlurEvent);
    pubSub.subscribe('nav/visibility/changed', positionSearchForm);
  }

  return {
    init
  }
}

export default TriggerSearch;
