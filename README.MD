# app.env

Small utility to load environment configurations that works for both, node and the browser.

## Usage

In most cases, all you need to do is invoke load function:
```javascript
import { load } from 'app.env';

load().then((env) => console.log('Env ready', env));
```
The above will load app.env file and append it to global object (`proccess.env` for node and `window.env` for browser).
`load()` takes an optional argument specifying custom path to the file (defaults to `app.env`).

## Behind the scenes
* Node: the file is loaded from your file system.
* Browser: the file is fetched from the same server that's serving HTML & JS files.