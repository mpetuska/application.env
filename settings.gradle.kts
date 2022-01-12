plugins {
  id("de.fayard.refreshVersions") version "0.30.2"
  id("com.gradle.enterprise") version "3.8"
}

refreshVersions {
  extraArtifactVersionKeyRules(rootDir.resolve("versions.rules"))
}

rootProject.name = "APPLICATION.ENV"

include(":test")

include(
  ":application.env",
  ":application.env:application.env-core",
)
