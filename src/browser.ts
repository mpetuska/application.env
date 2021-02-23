import { _appendEnv, EnvLoader } from "./common";
import { browserDefaultLoadOptions, LoadOptions } from "./LoadOptions";
import type { Env } from "./common";

window.env = window.env || {};

export const loadEnvFile = async (path: string): Promise<string> => {
  const res = await fetch(path);
  const text = await res.text();
  if (text.startsWith("<")) {
    throw new Error("Invalid .env file. Looks like default HTML file.");
  } else {
    return text;
  }
};

export const load: EnvLoader = async (
  options: LoadOptions = {}
): Promise<Env> => {
  const opt = { ...browserDefaultLoadOptions, ...options };
  try {
    const dotenvStr = await loadEnvFile(opt.path);
    return _appendEnv(dotenvStr, window, options.validator);
  } catch (e) {
    if (opt.failSilently) {
      return {};
    } else {
      throw e;
    }
  }
};

export default load;
