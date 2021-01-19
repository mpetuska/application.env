import { LoadOptions } from "./LoadOptions";

export type EnvLoader = (options?: LoadOptions) => Promise<ApplicationEnv.Env>;
type GlobalObject = typeof window | typeof process;
declare global {
  namespace ApplicationEnv {
    /**
     * To be augmented by consumer projects
     */
    // eslint-disable-next-line no-unused-vars
    interface Env extends Record<string, string | undefined> {}
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

const isNode = typeof window === "undefined";

export const parseEnv = (dotEnvStr: string): ApplicationEnv.Env => {
  // Try parse envfile string
  const result: ApplicationEnv.Env = {};
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
): ApplicationEnv.Env => {
  const obj = dotenvStr ? parseEnv(dotenvStr) : undefined;
  const env: ApplicationEnv.Env = {
    ...globalObj?.env,
    ...obj,
  };
  if (globalObj) {
    globalObj.env = env;
  }
  return env;
};

export const load = async (
  options?: LoadOptions
): Promise<ApplicationEnv.Env> => {
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
