import { parse } from 'envfile';
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

const loadEnvObject = async (path: string): Promise<Env | undefined> => {
    let loader: undefined | EnvFileLoader = undefined;
    if (isBrowser && !isNode) {
        const { loadEnvFile } = await import('./internal/browser');
        loader = loadEnvFile;
    }
    if (isNode && !isBrowser) {
        const { loadEnvFile } = await import('./internal/node');
        loader = loadEnvFile;
    }
    const text = loader && await loader(path);
    return text ? parse<Env>(text) : undefined;
}

const getGlobalObject = (): typeof window | typeof process | undefined => {
    if (isBrowser && !isNode) {
        return window;
    }
    if (isNode && !isBrowser) {
        return process;
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
