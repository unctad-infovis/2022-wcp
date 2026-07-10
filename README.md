# 2022-wcp

**Live demo** https://unctad-infovis.github.io/2022-wcp/

## About

An interactive widget for UNCTAD's World Consumer Protection Map. Users pick a question from a dropdown (e.g. "Countries with a specific law(s) on consumer protection") to switch between 11 Datawrapper maps, and browse a flag grid of every country grouped by yes/no/no-answer for the selected question, with click-to-highlight cross-referencing between the flag grid and the map.

### Used in

* [World consumer protection map](https://unctad.org/topic/competition-and-consumer-protection/consumer-protection-map)
* [UNCTAD Trade Twitter](https://twitter.com/UNCTADTrade/status/1551463552665505793)
* [UNCTAD Trade Twitter](https://twitter.com/UNCTADTrade/status/1554006587005714432)
* [UNCTAD Trade Twitter](https://twitter.com/UNCTADTrade/status/1556543325653667843)

## Rights of usage

Contact Teemo Tebest.

## How to build and develop

This is a Vite + React project.

* `npm install`
* `npm start`

Project should start at: http://localhost:8080

For developing please refer to `package.json`

## Files and folders

All public assets go to folder `public`.

All source code goes to folder `src`.

### Data files

`public/assets/data/2022-wcp_data.json` powers the flag grid and question dropdown. It is generated from `data/2022-wcp - Data - Data.csv` (196 countries, one row per country, one column per consumer-protection question, values `1`/`0`/blank).

#### Updating the data

1. Edit or replace `data/2022-wcp - Data - Data.csv` (keep the header row and column order).
2. Run `npm run convert-data` to regenerate `public/assets/data/2022-wcp_data.json`.
3. Run `npm run build` and deploy.

## Packages

The following packages are used in this project by default.

### Project specific

* **d3** - used for the flag-grid reveal animation

### Build & Dev Server

* **vite** — development server with hot module replacement and production bundler, replaces webpack
* **@vitejs/plugin-react** — adds React and JSX support to Vite

### React

* **react** — UI component library
* **react-dom** — renders React components to the DOM

### Formatter & Linter

* **@biomejs/biome** — formats and lints JS, JSX and CSS files on save, replaces ESLint + Prettier

### Minification

* **terser** — minifies the production JavaScript bundle, removes console.logs in production builds

### MDX

* **@mdx-js/rollup** — Vite/Rollup plugin that compiles MDX files into React components
* **@mdx-js/react** — provides React context for MDX components
