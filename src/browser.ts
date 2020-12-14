import { DEFAULT_PATH, EnvLoader, _appendEnv } from "./common";

window.env = window.env || {};

const loadEnvFile = async (path: string): Promise<string> => {
    const res = await fetch(path);
    const text = await res.text();
    if (text.startsWith('<')) {
        throw new Error("Invalid .env file. Looks like default HTML file.")
    } else {
        return text;
    }
};

export const load: EnvLoader = async (path: string = DEFAULT_PATH) => {
    const dotenvStr = await loadEnvFile(path);
    return _appendEnv(dotenvStr, window);
}

export default load;