export interface LoadOptions {
  failSilently?: boolean;
}

export const defaultLoadOptions: Required<LoadOptions> = {
  failSilently: false,
};
