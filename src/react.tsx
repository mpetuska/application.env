import React, { useContext, useState, useEffect, ReactNode } from "react";
import { parseEnv } from "./common";
import { loadEnvFile } from "./browser";
import { once } from "lodash";

const createStateContext = once(<T,>() =>
  React.createContext<T | undefined>({} as any)
);
export const useStateContext = <T,>() => useContext(createStateContext<T>());

export interface ApplicationEnvProviderProps {
  path: string;
  children: ReactNode[];
}
const ApplicationEnvProvider = function <T>(
  props: ApplicationEnvProviderProps
) {
  const [config, setConfig] = useState<T>();
  const StateContext = createStateContext<T>();
  useEffect(() => {
    const fetchData = async () => {
      const result = await loadEnvFile(props.path);
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
