/* eslint-disable require-jsdoc */
import React, {
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import { parseEnv } from "./common";
import { loadEnvFile } from "./browser";
import once from "lodash.once";

// once<T extends (...args: any) => any>(func: T): T;
interface LoadOptions {
  path?: string;
}
// once<T extends (...args: any) => any>(func: T): T;

const createStateContext = once(<T,>() =>
  React.createContext<T | undefined>({} as any)
);
export const useApplicationEnv = <T,>() => useContext(createStateContext<T>());

const ApplicationEnvProvider = <T extends unknown>(
  props: PropsWithChildren<LoadOptions> = { path: "/applcation.env" }
) => {
  const [config, setConfig] = useState<T>();
  const StateContext = createStateContext<T>();
  useEffect(() => {
    const fetchData = async () => {
      const result = await loadEnvFile(props.path || "/application.env");
      const envObject = parseEnv<T>(result);
      setConfig(envObject);
    };

    fetchData();
  }, []);
  return (
    <StateContext.Provider value={config}>
      {props.children}
    </StateContext.Provider>
  );
};

export default ApplicationEnvProvider;
