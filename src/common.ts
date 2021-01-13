import { LoadOptions } from "./LoadOptions";

export type EnvLoader = (options?: LoadOptions) => Promise<Env>;
type GlobalObject = typeof window | typeof process;
declare global {
  namespace ApplicationEnv {
    /**
     * To be augmented by consumer projects
     */
    // eslint-disable-next-line no-unused-vars
    interface Env {}
  }

  type Env = Record<string, string | undefined> & ApplicationEnv.Env;
  // eslint-disable-next-line no-unused-vars
  interface Window {
    env: Env;
  }

  namespace NodeJS {
    // eslint-disable-next-line no-unused-vars
    interface Global extends Record<string, unknown> {
      env: NodeJS.ProcessEnv & Env;
    }
    // eslint-disable-next-line no-unused-vars
    interface Process {
      env: NodeJS.ProcessEnv & Env;
    }
  }
}

const isNode = typeof window === "undefined";

export const parseEnv = (dotEnvStr: string): Env => {
  // Try parse envfile string
  const result: Env = {};
  const lines = dotEnvStr.toString().split("\n");
  for (const line of lines) {
    const match = line.match(/^([^=:#]+?)[=:](.*)/);
    if (match) {
      const key = match[1].trim();
      result[key] = match[2].trim();
    }
  }
  return result;
};

export const _appendEnv = (
  dotenvStr?: string,
  globalObj?: GlobalObject
): Env => {
  const obj = dotenvStr ? parseEnv(dotenvStr) : undefined;
  const env: Env = {
    ...globalObj?.env,
    ...obj,
  };
  if (globalObj) {
    globalObj.env = env;
  }
  return env;
};

export const load = async (options?: LoadOptions): Promise<Env> => {
  let loader: undefined | EnvLoader;
  if (isNode) {
    console.debug("NodeJS runtime");
    loader = (await import("./node")).load;
  } else {
    console.debug("Browser runtime");
    loader = (await import("./browser")).load;
  }
  return loader ? loader(options) : {};
};

export default load;
