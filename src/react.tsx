import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import loadEnv from "./browser";
import { LoadOptions } from "./LoadOptions";
import type { Env } from "./common";

type ApplicationEnvContext = React.Context<Env | undefined>;
let applicationContext:
  | React.Context<ApplicationEnv.Env | undefined>
  | undefined;
const createStateContext = (): ApplicationEnvContext => {
  if (applicationContext) {
    return applicationContext;
  } else {
    applicationContext = React.createContext<Env | undefined>(undefined);
    return applicationContext;
  }
};
export const useApplicationEnv = (): ApplicationEnv.Env | undefined =>
  useContext(createStateContext());

const ApplicationEnvProvider: React.FC<PropsWithChildren<LoadOptions>> = ({
  children,
  ...props
}) => {
  const [config, setConfig] = useState<Env>();
  const StateContext = createStateContext();
  useEffect(() => {
    loadEnv(props)
      .then((env) => setConfig(env))
      .catch(console.error);
  }, []);
  return (
    <StateContext.Provider value={config}>{children}</StateContext.Provider>
  );
};

export default ApplicationEnvProvider;
