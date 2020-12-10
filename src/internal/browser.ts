import { EnvFileLoader } from "./common";


export const loadEnvFile: EnvFileLoader = async (path: string) => {
    const res = await fetch(path);
    const text = await res.text();
    if (text.startsWith('<')) {
        throw new Error("Invalid .env file. Looks like default HTML file.")
    } else {
        return text;
    }
}