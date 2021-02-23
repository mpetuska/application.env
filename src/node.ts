import fs from "fs";
import type { Env } from "./common";
import { _appendEnv, EnvLoader } from "./common";
import { LoadOptions, nodeDefaultLoadOptions } from "./LoadOptions";

export const loadSync = (options: LoadOptions = {}): Env => {
  const opt = { ...nodeDefaultLoadOptions, ...options };
  let dotenvStr: string | undefined;
  try {
    dotenvStr = fs.readFileSync(opt.path, "utf-8");
  } catch (e) {
    if (opt.failSilently) {
      return {};
    } else {
      throw e;
    }
  }
  return _appendEnv(dotenvStr, process, options.validator);
};

export const load: EnvLoader = async (
  options: LoadOptions = {}
): Promise<Env> => {
  const opt = { ...nodeDefaultLoadOptions, ...options };
  let dotenvStr: string | undefined;
  try {
    dotenvStr = await fs.promises.readFile(opt.path, "utf-8");
  } catch (e) {
    if (opt.failSilently) {
      return {};
    } else {
      throw e;
    }
  }
  return _appendEnv(dotenvStr, process, options.validator);
};

export default load;
