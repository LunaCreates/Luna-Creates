function TriggerSearch(header: HTMLElement) {
  const triggerSearch = header.querySelector('[data-trigger-search]') as HTMLButtonElement;
  const closeSearch = header.querySelector('[data-close-search]') as HTMLButtonElement;
  const searchBar = header.querySelector('[data-search]') as HTMLElement;

  function showSearchBar() {
    const searchInput = header.querySelector('[id="search"]') as HTMLInputElement;

    header.classList.add('header--search-open');
    searchBar?.classList.add('search--visible');
    searchInput.focus();
  }

  function closeSearchBar() {
    header.classList.remove('header--search-open');
    searchBar?.classList.remove('search--visible');
    triggerSearch.focus();
  }

  function init() {
    triggerSearch.addEventListener('click', showSearchBar);
    closeSearch.addEventListener('click', closeSearchBar);
  }

  return {
    init
  }
}

export default TriggerSearch;
