import fs from "fs";
import { _appendEnv, EnvLoader } from "./common";
import { nodeDefaultLoadOptions, LoadOptions } from "./LoadOptions";
import type { Env } from "./common";

export const loadSync = (options: LoadOptions = {}): Env => {
  const opt = { ...nodeDefaultLoadOptions, ...options };
  try {
    const dotenvStr = fs.readFileSync(opt.path, "utf-8");
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
  options: LoadOptions = {}
): Promise<Env> => {
  const opt = { ...nodeDefaultLoadOptions, ...options };
  try {
    const dotenvStr = await fs.promises.readFile(opt.path, "utf-8");
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
