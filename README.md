[![Netlify Status](https://api.netlify.com/api/v1/badges/959b1267-1148-48d7-a42d-261bfd4df012/deploy-status)](https://app.netlify.com/sites/lunacreates/deploys)

# Luna Creates Website

## Setup
This is a [Jamstack](https://jamstack.org/) Shopify website built with the following stack:

- [Eleventy](https://www.11ty.dev/) (SSG)
- [Nunjucks](https://mozilla.github.io/nunjucks/) (Template language used in Eleventy)
- [Netlify](https://www.netlify.com/) (Hosting, Lambda Functions, Large Media, Forms)
- [Forestry](https://forestry.io/) (CMS)
- [SCSS](https://sass-lang.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Algolia](https://www.algolia.com/doc/) (Product search)

### Shopify Data
The Shopify data is pulled using the [Shopify Storefront API](https://shopify.dev/docs/storefront-api). You will need the following `ENV` variables to pull the data:

- `STOREFRONT_API_TOKEN`
- `STOREFRONT_API_URL`

### Algolia
We are using the Algolia JavaScript Client as our hosted search engine. You will need the following `ENV` variables to access the search data:

- `ALGOLIA_ADMIN_KEY`
- `ALGOLIA_APPLICATION_ID`
- `ALGOLIA_INDEX`

### Forestry
Forestry is a GIT bases CMS, meaning all the content for the CMS is pulled directly from this repo. The content is in Markdown format and lives in `src/site/posts`. Click the link above to read more about how Forestry works.

## Commands

### Development

- `npm run webpack:dev`: Compiles SCSS and Typescript in development mode and listens for changes to SCSS and TypeScript files
- `npm run eleventy:dev`: Spins up local environment of eleventy and lsitens for changes to Nunjucks files
- `npm run dev`: Concurrently runs `webpack:dev` and `eleventy:dev` to spin up local environamt
- `netlify dev`: Spins up local Netlify dev environment to allow the use of features metioned in stack. Netlify CLI is needed to run this command.

### Production

- `npm run webpack:prod`: Compiles SCSS and Typescript ready for production
- `npm run eleventy:prod`: Compiles Nunjucks files ready for production
- `npm run build`: Command used in netlify to run `webpack:prod` and `eleventy:prod`
