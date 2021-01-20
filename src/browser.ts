import { _appendEnv, EnvLoader } from "./common";
import { defaultLoadOptions, LoadOptions } from "./LoadOptions";

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

export const load: EnvLoader = async (options: LoadOptions = {}) => {
  const opt = { ...defaultLoadOptions, ...options };
  try {
    const dotenvStr = await loadEnvFile(opt.path);
    return _appendEnv(dotenvStr, window);
  } catch (e) {
    if (opt.failSilently) {
      return {};
    } else {
      throw e;
    }
  }
};

export default load;
