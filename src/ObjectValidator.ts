export type ValueValidator<T> = {
  /**
   * Default value to set if env variable is not set
   */
  default?: T;
  /**
   * Error message to return if no env variable or default is set
   */
  errorMessage?: string;
  /**
   * Terminates the application if no env variable or default is set via `process.exit(1)`.
   * Only applicable for NodeJS.
   */
  critical?: boolean;
};

export type ObjectValidator<T> = {
  [P in keyof T]: ValueValidator<T[P]>;
};
