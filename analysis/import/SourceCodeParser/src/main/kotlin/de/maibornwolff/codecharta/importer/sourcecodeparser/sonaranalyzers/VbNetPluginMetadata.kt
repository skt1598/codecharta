package de.maibornwolff.codecharta.importer.sourcecodeparser.sonaranalyzers

import org.sonarsource.dotnet.shared.plugins.DotNetPluginMetadata

class VbNetPluginMetadata : DotNetPluginMetadata {
    private val LANGUAGE_KEY = "vbnet"
    private val LANGUAGE_NAME = "VB.NET"

    private val REPOSITORY_KEY = "vbnet"
    private val PLUGIN_KEY = "vbnet"
    private val SONARANALYZER_NAME = "SonarAnalyzer.VisualBasic"


    override fun languageKey(): String {
        return LANGUAGE_KEY
    }

    override fun pluginKey(): String {
        return PLUGIN_KEY
    }

    override fun languageName(): String {
        return LANGUAGE_NAME
    }

    override fun shortLanguageName(): String {
        return LANGUAGE_NAME
    }

    override fun sonarAnalyzerName(): String {
        return SONARANALYZER_NAME
    }

    override fun repositoryKey(): String {
        return REPOSITORY_KEY
    }

}