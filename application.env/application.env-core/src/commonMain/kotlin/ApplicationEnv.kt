package dev.petuska.application.env.core

public interface ApplicationEnv : Map<String, String> {
  public companion object {
    public fun parse(dotEnvContent: String): ApplicationEnv {
      val lines = dotEnvContent.split("\n")
    }
  }
}

internal expect val processEnv: Map<String, String>
