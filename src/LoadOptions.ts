export interface LoadOptions {
  path?: string;
  failSilently?: boolean;
}

export const defaultLoadOptions: Required<LoadOptions> = {
  path: "application.env",
  failSilently: false,
};
