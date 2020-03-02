## Playground for SSR and Prerendering with Angular

### Installing and building

Install all dependencies as usual.
Just to make sure everything is fine, run the project locally:

```bash
npm install
ng serve
```

If you want, you can take a look at the HTML source code in the browser. It should show the typical `index.html` skeleton with an almost empty `<app-root></app-root>` element.

We then need separate builds for client and server.

```bash
# Client
ng build --prod

# Server
ng run ssr-playground:server:production


# OR both together
npm run build:ssr
```

You should now find a `dist` folder with two sub-directories:

```
- dist
  - ssr-playground
    - browser
    - server
```

We can take a look at the server now!

### Compiling the server for SSR

The server part is a TypeScript program for Node.js in the `server.ts` file.
It is already bundled with the application in `dist/ssr-playground/server/main.js` after running `npm run build:ssr`.


### Running Server-side rendering

Run the Express server with live server-side rendering:

```bash
node dist/ssr-playground/server/main
# OR
npm run serve:ssr
```

Open your browser at [http://localhost:4000](http://localhost:4000) to see it in action. When you show the source code in the browser you should see the server-side rendered HTML.


#### Pre-rendering


```bash
npm run prerender
```

You should now find some subfolders in the `dist/browser` directory, according to the routes of the application.
Run a local web server there, e.g. `angular-http-server` or `http-server`:

```bash
cd dist/ssr-playground/browser
npx http-server
```

Open your browser at [http://localhost:8080](http://localhost:8080).
This should be blazing fast because it just shows the prerendered pages without doing any rendering at runtime.
The Angular application bundles will kick in later and take over the static page.


