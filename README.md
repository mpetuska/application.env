[![gitpod ready-to-code](https://img.shields.io/badge/gitpod-ready--to--code-blue?logo=gitpod&style=flat-square)](https://gitpod.io/#https://github.com/mpetuska/application.env)
[![npm](https://img.shields.io/npm/v/application.env?logo=npm&style=flat-square)](https://www.npmjs.com/package/application.env)
# application.env

Small utility to load environment configurations that works for both, node and the browser, including a react context helper for react apps.

## Usage

In most cases, all you need to do is invoke load function:

```javascript
import { load } from 'application.env';

load().then((env) => console.log('Env ready', env));
```

The above will load `application.env` file and append it to global object (`proccess.env` for Node and `window.env`
for Browser).

> For Node you also get sync option:
> ```javascript
> import { loadSync } from 'application.env/node';
>
> const env = loadSync();
> console.log(env === proccess.env); // true
> ```

All load variants takes an optional options argument. Here's how its fields look with their default values:

```typescript
function load(
  options: LoadOptions = {
    path: string = 'application.env', // Path to a file
    failSilently: false, // Returns/appends an empty object on error instead of throwing it.
  }): Promise<ApplicationEnv.Env> {}
```

## TypeScript
The module comes with it's own type declarations on both, public API and global scope extensions. It's also possible to declare your own named properties on loaded Env object via TS augmentation on `ApplicationEnv` namespace:
```typescript
declare global {
  namespace ApplicationEnv {
    interface Env {
      MY_PROP_ONE?: string;
      ANOTHER_REQUIRED_PROP: string;
      ANOTHER_OPTIONAL_PROP: string;
      NODE_ENV?: string;
    }
  }
}
```

## React
This module exposes a React context provider and hook to consume the context in a child component

```typescript 

import ApplicationEnvProvider, { useApplicationEnv } from 'application.env/react';

const App: FC = (): JSX.Element => {
  return (
    <ApplicationEnvProvider path="/application.env">
      <Child>
    </ApplicationEnvProvider>
  );
};

const Child: FC = () : JSX.Element => {
  const envVars = useApplicationEnv();

  return (<h1>{envVars.MY_PROP_ONE}</h1>)
}

export default App;
```

## Behind the scenes

* Node: the file is loaded from your file system.
* Browser: the file is fetched from the same server that's serving HTML & JS files.
* React: the file is fetched from the same server that's serving HTML & JS files.
