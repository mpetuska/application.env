import { _appendEnv, DEFAULT_PATH, EnvLoader } from "./common";
import { defaultLoadOptions, LoadOptions } from "./LoadOptions";

window.env = window.env || {};

const loadEnvFile = async (path: string): Promise<string> => {
  const res = await fetch(path);
  const text = await res.text();
  if (text.startsWith("<")) {
    throw new Error("Invalid .env file. Looks like default HTML file.");
  } else {
    return text;
  }
};

export const load: EnvLoader = async (
  path: string = DEFAULT_PATH,
  options: LoadOptions = {}
) => {
  const opt = { ...defaultLoadOptions, ...options };
  try {
    const dotenvStr = await loadEnvFile(path);
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
