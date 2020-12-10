import { EnvFileLoader } from "./common";


export const loadEnvFile: EnvFileLoader = async (path: string) => fetch(path).then(it => it.text());