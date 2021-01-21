export interface LoadOptions {
  path?: string;
  failSilently?: boolean;
}

export const browserDefaultLoadOptions: Required<LoadOptions> = {
  path: "/application.env",
  failSilently: false,
};

export const nodeDefaultLoadOptions: Required<LoadOptions> = {
  path: "application.env",
  failSilently: false,
};
