import fs from "fs";
import type { Env } from "./common";
import { _appendEnv, EnvLoader } from "./common";
import { LoadOptions, nodeDefaultLoadOptions } from "./LoadOptions";
import { ObjectValidator } from "./ObjectValidator";

export const loadSync = (
  options: LoadOptions = {},
  validator?: ObjectValidator<Env>
): Env => {
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
  return _appendEnv(dotenvStr, process, validator);
};

export const load: EnvLoader = async (
  options: LoadOptions = {},
  validator?: ObjectValidator<Env>
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
  return _appendEnv(dotenvStr, process, validator);
};

export default load;
