import algoliasearch from 'algoliasearch/lite';

const client = algoliasearch('9R4CE6G9A3', '6e7ae6646b1c8ffe5fa627f46c476d99');
const index = client.initIndex('docsearch__luna');
const params = { attributesToRetrieve: ['title', 'url', 'image'] };

interface SearchResultTypes {
  objectID: string,
  title?: string,
  url?: string,
  image?: string
}

function Search(input: HTMLInputElement) {
  function renderResult(hit: SearchResultTypes) {
    const image = hit.image;

    return `
      <li>
        <picture class="results__picture">
          <source  type="image/webp" data-srcset="${image}_150x150.jpg.webp 1x, ${image}_300x300.jpg.webp 2x">

          <img class="results__image lazyload" data-srcset="${image}_150x150.jpg 1x, ${image}_300x300.jpg 2x" role="presentation" width="100" height="100" loading="lazy">
        </picture>
        <a href="${hit.url}" class="results__link">${hit.title}</a>
      </li>
    `
  }

  function handleSearchResults(hits: SearchResultTypes[]) {
    if (hits.length > 0) {
      const html = `<ul class="results">${hits.map(renderResult).join('')}</ul>`;

      console.log(hits, 'kfdjfgidfhu');


      input.insertAdjacentHTML('afterend', html);
    }
  }

  function handleChangeEvent(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    index.search(value, params).then(({ hits }) => handleSearchResults(hits));
  }

  function init() {
    input.addEventListener('input', handleChangeEvent);
  }

  return {
    init
  }
}

export default Search;
