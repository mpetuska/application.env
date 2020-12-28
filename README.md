# application.env

Small utility to load environment configurations that works for both, node and the browser.

## Usage

In most cases, all you need to do is invoke load function:
```javascript
import { load } from 'application.env';

load().then((env) => console.log('Env ready', env));
```
The above will load `application.env` file and append it to global object (`proccess.env` for node and `window.env` for browser).
`load()` takes an optional argument specifying custom path to the file (defaults to `application.env`).

> For Node you also get sync option:
> ```javascript
> import { loadSync } from 'application.env/node';
>
> const env = loadSync();
> console.log(env === proccess.env); // true
> ```


## Behind the scenes
* Node: the file is loaded from your file system.
* Browser: the file is fetched from the same server that's serving HTML & JS files.