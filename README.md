# sn-react-typescript-memo

[![Netlify Status](https://api.netlify.com/api/v1/badges/f3d58505-1366-49cc-b6f2-4b2fcc560966/deploy-status)](https://app.netlify.com/sites/snmemo/deploys)
 
Memo app for sensenet SPA development with React and Typescript

## Package content

- An example tasklist React SPA with sensenet repository login, written in Typescript ✨
- An example Jest test with Enzyme 👓
- Preconfigured Webpack build 🧱
- prettier and eslint 💅
- husky lint & prettier precommit hook ⚓

## Getting started

Be sure that you have installed a GIT client, Node.JS (latest or LTS). You can use NPM or Yarn.

### Using as a template

1. Clone a GIT repository with `git clone https://github.com/blaskodaniel/snmemoapp`
1. cd into the cloned directory
1. Install the package dependencies with `npm install` or `yarn install`

### Starting the dev server

1. Start the Webpack dev server with `npm run start` or `yarn start`
1. You can browse the app once the build has been finished at [http://localhost:8081/](http://localhost:8081/)

### Building the project

You can simply run `npm run build` or `yarn build` to create the bundle. It will saved to the `./bundle` directory

### Running tests

1. Simply run `npm run test` or `yarn test` to run the tests. A coverage report will be also generated to the `./coverage` directory

### Application Structure

```
- src
  | - assets
  | | - static assets like images, fonts, etc...
  | - components
  | | - generic components like forms, buttons, inputs
  | - context
  | | - React contexts and context providers
  | - hooks
  | | - Custom React hooks like useRepository or useCurrentUser.
  | ...
  | main / container components, layouts
  | ...
  | - app.tsx - The main entry point of your application
  | - index.tsx - React and Sensenet Repository initialization
  | - style.css - generic css overrides
```

### Netlify site

1. Log in to Netlify. If you don't have a Netlify account, sign up for free [here](https://www.netlify.com/)
1. Create a new site with _New site_ from Git button
1. Select GitHub at _Continuous Deployment_ section
1. Authorize Netlify on GitHub modal window
1. Select repository for deploy
    1. If you don't see your repository, you can configure Netlify from the link at the bottom of the page
1. At Deploy settings you can configure 
    1. from which branch it will be created
    1. Build command: `npm run build`
    1. Publish directory: `bundle`


## Recommended goodies

- [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
