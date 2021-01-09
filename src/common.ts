import { LoadOptions } from "./LoadOptions";

export type Env = Record<string, string | undefined>;
export type EnvLoader = (path?: string, options?: LoadOptions) => Promise<Env>;
type GlobalObject = typeof window | typeof process;
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    env: Env;
  }

  namespace NodeJS {
    // eslint-disable-next-line no-unused-vars
    interface Process {
      env: NodeJS.ProcessEnv & Env;
    }
  }
}

const isBrowser = typeof window === "object" && typeof process === "undefined";
const isNode = typeof window === "undefined" && typeof process === "object";
export const DEFAULT_PATH = "application.env";

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

export const load = async (
  path: string = DEFAULT_PATH,
  options: LoadOptions
): Promise<Env> => {
  let loader: undefined | EnvLoader = undefined;
  if (isBrowser && !isNode) {
    loader = (await import("./browser")).load;
  } else if (isNode && !isBrowser) {
    loader = (await import("./node")).load;
  }
  return loader ? loader(path, options) : {};
};

export default load;
