export type Env = Record<string, string | undefined>;
export type EnvLoader = (path?: string) => Promise<Env>;
type GlobalObject = typeof window | typeof process;
declare global {
    interface Window {
        env: Env
    }
}

const isBrowser = typeof window === 'object' && typeof process === 'undefined';
const isNode = typeof window === 'undefined' && typeof process === 'object';
export const DEFAULT_PATH = 'application.env';

export const parseEnv = (src: string): Env => {
    // Try parse envfile string
    const result: Env = {};
    const lines = src.toString().split('\n');
    for (const line of lines) {
        const match = line.match(/^([^=:#]+?)[=:](.*)/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim();
            result[key] = value;
        }
    }
    return result;
};

export const _appendEnv = (dotenvStr?: string, globalObj?: GlobalObject): Env => {
    const obj = dotenvStr ? parseEnv(dotenvStr) : undefined;
    const env: Env = {
        ...globalObj?.env,
        ...obj,
    };
    if (globalObj) {
        globalObj.env = env;
    }
    return env;
}

export const load = async (path: string = 'application.env'): Promise<Env> => {
    let loader: undefined | EnvLoader = undefined;
    if (isBrowser && !isNode) {
        loader = (await import('./browser')).load;
    } else if (isNode && !isBrowser) {
        loader = (await import('./node')).load;
    }
    return loader ? loader(path) : {};
};

export default load;
