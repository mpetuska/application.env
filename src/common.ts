import { LoadOptions } from "./LoadOptions";
import { ObjectValidator } from "./ObjectValidator";

type GlobalObject = typeof window | typeof process;
declare global {
  export namespace ApplicationEnv {
    /**
     * To be augmented by consumer projects
     */
    // eslint-disable-next-line no-unused-vars
    interface Env
      extends Record<string, string | undefined>,
        Record<string, unknown> {}
  }
  // eslint-disable-next-line no-unused-vars
  interface Window {
    env: ApplicationEnv.Env;
  }

  // eslint-disable-next-line no-unused-vars
  namespace NodeJS {
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
    if (!env[key]) {
      if (valid.default) {
        console.warn(
          `Env variable [${key}] missing. Using provided default value. ${
            valid.errorMessage ?? ""
          }`
        );
        env[key] = valid.default;
      } else {
        const message = `Env variable [${key}] missing. ${
          valid.errorMessage ?? ""
        }`;
        if (valid.critical && globalObj === process) {
          console.error(message);
          process.exit(1);
        } else {
          throw new Error(message);
        }
      }
    } else if (valid.converter) {
      const value = env[key];
      env[key] = value && valid.converter(value);
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
