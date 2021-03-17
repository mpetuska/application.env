import { LoadOptions } from "./LoadOptions";
import { ObjectValidator } from "./ObjectValidator";

type GlobalObject = typeof window | typeof process;
declare global {
  export namespace ApplicationEnv {
    /**
     * To be augmented by consumer projects
     */
    // eslint-disable-next-line no-unused-vars
    interface Env {}
  }
  // eslint-disable-next-line no-unused-vars
  interface Window {
    env: ApplicationEnv.Env;
  }

  // eslint-disable-next-line no-unused-vars
  namespace NodeJS {
    // @ts-ignore
    // eslint-disable-next-line no-unused-vars
    interface ProcessEnv extends ApplicationEnv.Env {}
  }
}
export type Env = ApplicationEnv.Env;
export type EnvLoader = (options?: LoadOptions) => Promise<Env>;

const isNode = typeof window === "undefined";

const parseEnv = (dotEnvStr: string): Env => {
  // Try parse envfile string
  const obj: Env = {};
  const lines = dotEnvStr.toString().split("\n");
  for (const line of lines) {
    const match = line.match(/^([^=:#]+?)[=:](.*)/);
    if (match) {
      const key = match[1].trim();
      // @ts-ignore
      obj[key] = match[2].trim();
    }
  }
  return obj;
};

export const _appendEnv = (
  dotenvStr?: string,
  globalObj?: GlobalObject,
  validator?: ObjectValidator<Env>
): Env => {
  const obj = dotenvStr ? parseEnv(dotenvStr) : undefined;
  const env: Env = {
    ...globalObj?.env,
    ...obj,
  };

  for (const [key, valid] of Object.entries(validator || {})) {
    // @ts-ignore
    if (!env[key]) {
      // @ts-ignore
      if (valid.default) {
        console.warn(
          `Env variable [${key}] missing. Using provided default value. ${
            // @ts-ignore
            valid.errorMessage ?? ""
          }`
        );
        // @ts-ignore
        env[key] = valid.default;
      } else {
        const message = `Env variable [${key}] missing. ${
          // @ts-ignore
          valid.errorMessage ?? ""
        }`;
        // @ts-ignore
        if (valid.critical && globalObj === process) {
          console.error(message);
          process.exit(1);
        } else {
          throw new Error(message);
        }
      }
      // @ts-ignore
    } else if (valid.converter) {
      // @ts-ignore
      const value = env[key];
      // @ts-ignore
      env[key] = value && valid.converter(value as string);
    }
  }
  if (globalObj) {
    globalObj.env = env;
  }
  return env;
};

export const load = async (options?: LoadOptions): Promise<Env> => {
  let loader: undefined | EnvLoader;
  if (isNode) {
    loader = (await import("./node")).load;
  } else {
    loader = (await import("./browser")).load;
  }
  return loader ? loader(options) : {};
};

export default load;
