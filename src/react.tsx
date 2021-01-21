import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import loadEnv from "./browser";
import { LoadOptions } from "./LoadOptions";

type ApplicationEnvContext = React.Context<ApplicationEnv.Env | undefined>;
let applicationContext:
  | React.Context<ApplicationEnv.Env | undefined>
  | undefined;
const createStateContext = (): ApplicationEnvContext => {
  if (applicationContext) {
    return applicationContext;
  } else {
    applicationContext = React.createContext<ApplicationEnv.Env | undefined>(
      undefined
    );
    return applicationContext;
  }
};
export const useApplicationEnv = (): ApplicationEnv.Env | undefined =>
  useContext(createStateContext());

const ApplicationEnvProvider: React.FC<PropsWithChildren<LoadOptions>> = ({
  children,
  ...props
}) => {
  const [config, setConfig] = useState<ApplicationEnv.Env>();
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
