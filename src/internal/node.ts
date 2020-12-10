import { EnvFileLoader } from "./common";
import fs from 'fs';


export const loadEnvFile: EnvFileLoader = async (path: string) => fs.promises.readFile(path, 'utf-8');