import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import loadEnv from "./browser";
import { LoadOptions } from "./LoadOptions";
import type { Env } from "./common";
import { ObjectValidator } from "./ObjectValidator";

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

const ApplicationEnvProvider: React.FC<
  PropsWithChildren<LoadOptions & { validator?: ObjectValidator<Env> }>
> = ({ children, ...props }) => {
  const [config, setConfig] = useState<Env>();
  const StateContext = createStateContext();
  useEffect(() => {
    loadEnv(props)
      .then((env) => setConfig(env))
      .catch((it) => {
        if (props.failSilently) {
          console.error(it);
        } else {
          throw it;
        }
      });
  }, []);
  return (
    <StateContext.Provider value={config}>{children}</StateContext.Provider>
  );
};

export default ApplicationEnvProvider;
