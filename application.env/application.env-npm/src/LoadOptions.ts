import { ObjectValidator } from "./ObjectValidator";
import { Env } from "./common";

export interface LoadOptions {
  path?: string;
  failSilently?: boolean;
  validator?: ObjectValidator<Env>;
}

const baseDefaults: Required<LoadOptions> = {
  path: "application.env",
  failSilently: false,
  validator: {},
};

export const browserDefaultLoadOptions: Required<LoadOptions> = {
  ...baseDefaults,
  path: "/application.env",
};

export const nodeDefaultLoadOptions: Required<LoadOptions> = {
  ...baseDefaults,
  path: "application.env",
};
