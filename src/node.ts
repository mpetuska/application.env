import fs from "fs";
import { _appendEnv, DEFAULT_PATH, EnvLoader } from "./common";
import { defaultLoadOptions, LoadOptions } from "./LoadOptions";

export const loadSync = (
  path: string = DEFAULT_PATH,
  options: LoadOptions = {}
): Env => {
  const opt = { ...defaultLoadOptions, ...options };
  try {
    const dotenvStr = fs.readFileSync(path, "utf-8");
    return _appendEnv(dotenvStr, process);
  } catch (e) {
    if (opt.failSilently) {
      return {};
    } else {
      throw e;
    }
  }
};

export const load: EnvLoader = async (
  path: string = DEFAULT_PATH,
  options: LoadOptions = {}
) => {
  const opt = { ...defaultLoadOptions, ...options };
  try {
    const dotenvStr = await fs.promises.readFile(path, "utf-8");
    return _appendEnv(dotenvStr, process);
  } catch (e) {
    if (opt.failSilently) {
      return {};
    } else {
      throw e;
    }
  }
};

export default load;
