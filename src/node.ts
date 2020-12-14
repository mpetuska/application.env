import fs from 'fs';
import { DEFAULT_PATH, Env, EnvLoader, _appendEnv } from './common';


export const loadSync = (path: string = DEFAULT_PATH): Env => {
    const dotenvStr = fs.readFileSync(path, 'utf-8');
    return _appendEnv(dotenvStr, process);
};

export const load: EnvLoader = async (path: string = DEFAULT_PATH) => {
    const dotenvStr = await fs.promises.readFile(path, 'utf-8');
    return _appendEnv(dotenvStr, process);
};

export default load;