/* eslint-disable require-jsdoc */
import React, {
  useContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import loadEnv from "./browser";
import { LoadOptions } from "./LoadOptions";

function once<T extends (...args: any) => any>(func: T): T {
  let n = 2;
  let result: any;
  return function (this: any, ...args: any) {
    if (--n > 0) {
      // eslint-disable-next-line no-invalid-this
      result = func.apply(this, args);
    }
    return result;
  } as T;
}
const createStateContext = once(<T,>() =>
  React.createContext<T | undefined>({} as any)
);
export const useApplicationEnv = <T,>() => useContext(createStateContext<T>());

const ApplicationEnvProvider = (props: PropsWithChildren<LoadOptions>) => {
  const [config, setConfig] = useState<ApplicationEnv.Env>();
  const StateContext = createStateContext<ApplicationEnv.Env>();
  useEffect(() => {
    loadEnv(props).then((env) => setConfig(env));
  }, []);
  return (
    <StateContext.Provider value={config}>
      {props.children}
    </StateContext.Provider>
  );
};

export default ApplicationEnvProvider;
