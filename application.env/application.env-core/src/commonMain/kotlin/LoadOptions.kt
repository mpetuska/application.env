package dev.petuska.application.env.core

public interface LoadOptions {
  public var path: String?
  public var failSilently: Boolean?
}

public internal expect val defaultOptions: LoadOptions
