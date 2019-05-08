# May Office Addin Community Call

The following project was used in May Office Dev Community call to show case various web apis that can be used in your web application and more specifically your add-ins.

The following demonstrations can be seen:
* Web Workers - *offloading work to another thread so you do not block main/ui thread*
* IndexedDB - *key/value document storage for storing and caching data*
* Web Sockets - *bi-directional tcp connection between client and server*
* Service Worker - *worker that acts as network proxy to provide offline experiences*


> __Important__ - The following application is built using Angular but the concepts behind these API's apply regardless of your framework of choice. Angular is what my team develops in so that was the fastest way for me to create the demo. Feel free to take the ideas here and apply them to your framework or just vanillajs if you like to roll-your-own.


> __SSL__ - I have included a self-signed cert that will pass Chrome security checks. However, you will probably need to install the cert in your CA so that the red warning goes away. Office might block if it is not. Be sure not to use in a real production scenario.


## Getting Started

First start by cloning this libary and installing dependencies. I personally use Yarn but NPM or another package manager will work.

>assumes you have Nodejs already installed on your computer. Latest LTS is preferred.

```bash
// install nodejs dependencies
yarn

// build and run local dev server for NON service worker app. This will be in watch mode
ng serve

// open second terminal/command window and start the simple socket server
node sockets/server.js

```

The Office Manifest can be found at the root of the project: `office-addin-cc.manifest.xml` that can be used for side-loading into __Excel__.

> The manifest is only configured for Excel at this time.


### Service Worker
The service worker requires building the application for production which does __NOT__ start the local dev server. Angular-cli does all the magic of setting up the service worker.

First, you need to build the application using the angular-cli as a production build which will include all the necessary stuff. You can checkout angular.io if you are curious to learn more.

```bash
// build production version of app. The output will be in the dist folder when finished

ng build --prod
```

Run the static server with ssl scripts and on port 4300 with no caching enabled on server side. 

```bash
http-server dist/office-addin-cc -p 4300 -c-1 --ssl --key ssl/server.key --cert ssl/server.crt

```


## Where is the code
I understand not everyone is an Angular developer so to help point you in the right direction you can look at the following files to see the logic for each API. Also, the code is written for demo purposes without erroring handling, duplicate functions, etc...so be sure to focus on the concepts. :)


* Web Worker
  - `src/app/web-worker/web-worker.component.ts`
  - `src/app/web-worker/simple-worker.js`
  - `src/app/web-worker/fib-worker.ts`
* IndexedDB
  - `src/app/indexeddb/indexeddb.component.ts`
  - take a look a the indexeddb wrapper library I used - https://github.com/jakearchibald/idb-keyval
* Web Socket
  - `src/app/web-socket/web-socket.component.ts`
  - `sockets/server.js` - sample socket server
* Service Worker
  - See angulars documentation https://angular.io/guide/service-worker-intro