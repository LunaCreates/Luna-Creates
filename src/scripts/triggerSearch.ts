import pubSub from './modules/pubSub';

function TriggerSearch(element: HTMLElement) {
  const header = document.querySelector('[data-component="header"]') as HTMLElement
  const triggerSearch = element.querySelector('[data-trigger-search]') as HTMLButtonElement;
  const searchBar = element.querySelector('[data-search-form]') as HTMLElement;

  function showSearchBar(button: HTMLButtonElement) {
    header.classList.remove('before:invisible');
    header.classList.add('before:opacity-50');
    button.setAttribute('aria-expanded', 'true');
    searchBar.classList.add('opacity-100');
  }

  function closeSearchBar(button: HTMLButtonElement) {
    header.classList.add('before:invisible');
    header.classList.remove('before:opacity-50');
    button.setAttribute('aria-expanded', 'false');
    searchBar.classList.remove('opacity-100');
  }

  function toggleSearchBar(event: Event) {
    const target = event.target as HTMLButtonElement;
    const isExpanded = target.getAttribute('aria-expanded') === 'true';

    isExpanded ? closeSearchBar(target) : showSearchBar(target);
  }

  function positionSearchForm(height: Number) {
    searchBar.style.top = `calc(100% + ${height}px)`;
  }

  function init() {
    triggerSearch.addEventListener('click', toggleSearchBar);
    pubSub.subscribe('nav/visibility/changed', positionSearchForm);
  }

  return {
    init
  }
}

export default TriggerSearch;
