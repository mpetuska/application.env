import { EnvFileLoader } from './internal/common';


export type Env = Record<string, string | undefined>;
declare global {
    interface Window {
        env: Env
    }
}
window.env = window.env || {}

const isBrowser = typeof window !== 'undefined' && typeof process === 'object';
const isNode = typeof window === 'undefined' && typeof process !== 'object';

const parse = (src: string): Env => {
	// Try parse envfile string
	const result: Env = {}
	const lines = src.toString().split('\n')
	for (const line of lines) {
		const match = line.match(/^([^=:#]+?)[=:](.*)/)
		if (match) {
			const key = match[1].trim()
			const value = match[2].trim()
			result[key] = value
		}
	}
	return result;
}

const loadEnvObject = async (path: string): Promise<Env | undefined> => {
    let loader: undefined | EnvFileLoader = undefined;
    if (isBrowser && !isNode) {
        const { loadEnvFile } = await import('./internal/browser');
        loader = loadEnvFile;
    } else if (isNode && !isBrowser) {
        const { loadEnvFile } = await import('./internal/node');
        loader = loadEnvFile;
    }
    const text = loader && await loader(path);
    return text ? parse(text) : undefined;
}

const getGlobalObject = (): typeof window | typeof process | undefined => {
    if (isBrowser && !isNode) {
        return window;
    } else if (isNode && !isBrowser) {
        return process;
    } else {
        return undefined;
    }
}

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
}
