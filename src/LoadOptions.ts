export interface LoadOptions {
  path?: string;
  failSilently?: boolean;
}

const commonDefaults: Partial<LoadOptions> = {
  failSilently: true,
};

export const browserDefaultLoadOptions: Required<LoadOptions> = {
  ...commonDefaults,
  path: "/application.env",
};

export const nodeDefaultLoadOptions: Required<LoadOptions> = {
  ...commonDefaults,
  path: "application.env",
};
