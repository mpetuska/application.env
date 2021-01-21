export interface LoadOptions {
  path?: string;
  failSilently?: boolean;
}

const baseDefaults: Required<LoadOptions> = {
  path: "application.env",
  failSilently: false,
};

export const browserDefaultLoadOptions: Required<LoadOptions> = {
  ...baseDefaults,
  path: "/application.env",
};

export const nodeDefaultLoadOptions: Required<LoadOptions> = {
  ...baseDefaults,
  path: "application.env",
};
