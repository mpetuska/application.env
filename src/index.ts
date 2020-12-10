export type Env = Record<string, string | undefined>;
export type EnvFileLoader = (path: string) => Promise<string>
declare global {
    interface Window {
        env: Env
    }
}

const isBrowser = typeof window === 'object' && typeof process === 'undefined';
const isNode = typeof window === 'undefined' && typeof process === 'object';

if (isBrowser) {
    window.env = window.env || {};
}

const parse = (src: string): Env => {
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

const loadEnvFileBrowser: EnvFileLoader = async (path: string) => {
    const res = await fetch(path);
    const text = await res.text();
    if (text.startsWith('<')) {
        throw new Error("Invalid .env file. Looks like default HTML file.")
    } else {
        return text;
    }
};
const loadEnvFileNode: EnvFileLoader = async (path: string) => {
    const fs = await import('fs');
    return fs.promises.readFile(path, 'utf-8')
};

const loadEnvObject = async (path: string): Promise<Env | undefined> => {
    let loader: undefined | EnvFileLoader = undefined;
    if (isBrowser && !isNode) {
        loader = loadEnvFileBrowser;
    } else if (isNode && !isBrowser) {
        loader = loadEnvFileNode;
    }
    const text = loader && await loader(path);
    return text ? parse(text) : undefined;
};

const getGlobalObject = (): typeof window | typeof process | undefined => {
    if (isBrowser && !isNode) {
        return window;
    } else if (isNode && !isBrowser) {
        return process;
    } else {
        return undefined;
    }
};

export const load = async (path: string = 'application.env'): Promise<Env> => {
    const obj = await loadEnvObject(path);
    const globalObj = getGlobalObject();
    const env: Env = {
        ...globalObj?.env,
        ...obj,
    };
    if (globalObj) {
        globalObj.env = env;
    }
    return env;
};

export default load;
