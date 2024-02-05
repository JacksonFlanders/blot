// should be top directory of project

import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import { build } from "./build.js";
import { wrapHTML } from "./backend/wrapHTML.js";

import navBar from "./backend/navBar.js";
import guides from "./backend/guides.js";

build({
  index: wrapHTML(`
    <link rel="stylesheet" href='./assets/initApp.css'>
    <link rel="stylesheet" href='https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css'>
    <main></main>
    <script type="module" src="./src/lib/initApp.js"></script>
  `),
  test: wrapHTML(`
    ${navBar()}
    <div class="bg-red-400">test another page</div>
  `),
  guides: wrapHTML(`
    ${navBar()}
    ${guides()}
  `),
  assembly: wrapHTML(`
    ${navBar()}
    Go <a class="underline decoration-sky-500" href="https://github.com/hackclub/blot/blob/main/docs/ASSEMBLY.md">here</a>.
  `)

});

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(join(__dirname, 'dist')));

app.use((req, res, next) => {
  let pathName = req.path;

  if (pathName === "/") pathName = "/index";

  if (req.path.indexOf('.') === -1) {
      const file = path.join(__dirname, 'dist', `${pathName}.html`);
      res.sendFile(file, (err) => {
          if (err) next();
      });
  } else {
      next();
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});


