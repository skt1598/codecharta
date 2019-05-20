package de.maibornwolff.codecharta.importer.sourcecodeparser.sourcecodeparser

import de.maibornwolff.codecharta.importer.sourcecodeparser.sonaranalyzers.DotnetSonarAnalyzer
import org.assertj.core.api.Assertions
import org.junit.Test
import java.io.File
import java.util.ArrayList

class DotNetSonarAnalyzerTest {
    private val path = File("src/test/resources/vb_samples").toString()

    @Test
    fun `single file is correctly analyzed`() {
        val fileList = ArrayList<String>()
        fileList.add("sample_file.frm")

        val dotNetSonarAnalyzer = DotnetSonarAnalyzer()
        val metrics = dotNetSonarAnalyzer.scanFiles(fileList, File(path))

        Assertions.assertThat(metrics.projectMetrics).containsKey("sample_file.frm")
    }

    @Test
    fun `multiple files are analyzed`() {
        val fileList = ArrayList<String>()
        fileList.add("foo.java")
        fileList.add("bar/foo.java")

        val dotNetSonarAnalyzer = DotnetSonarAnalyzer()
        val metrics = dotNetSonarAnalyzer.scanFiles(fileList, File(path))

        Assertions.assertThat(metrics.projectMetrics).containsKey("foo.java")
        Assertions.assertThat(metrics.projectMetrics).containsKey("bar/foo.java")
    }

    @Test
    fun `multiple analyzed files have metrics`() {
        val fileList = ArrayList<String>()
        fileList.add("sample_file.frm")
        //fileList.add("bar/foo.java")

        val dotNetSonarAnalyzer = DotnetSonarAnalyzer()
        val metrics = dotNetSonarAnalyzer.scanFiles(fileList, File(path))

        Assertions.assertThat(metrics.getFileMetricMap("sample_file.frm")?.fileMetrics).isNotEmpty
        //Assertions.assertThat(metrics.getFileMetricMap("bar/foo.java")?.fileMetrics).isNotEmpty
    }

    @Test
    fun `correct metrics are retrieved`() {
        val fileList = ArrayList<String>()
        fileList.add("sample_file.frm")

        val dotnetSonarAnalyzer = DotnetSonarAnalyzer()
        val metrics = dotnetSonarAnalyzer.scanFiles(fileList, File(path))

        Assertions.assertThat(metrics.getFileMetricMap("sample_file.frm")?.getMetricValue("rloc")).isEqualTo(31)
        Assertions.assertThat(metrics.getFileMetricMap("sample_file.frm")?.getMetricValue("functions")).isEqualTo(4)
        Assertions.assertThat(metrics.getFileMetricMap("sample_file.frm")?.getMetricValue("statements")).isEqualTo(13)
        Assertions.assertThat(metrics.getFileMetricMap("sample_file.frm")?.getMetricValue("classes")).isEqualTo(1)
        Assertions.assertThat(metrics.getFileMetricMap("sample_file.frm")?.getMetricValue("mcc")).isEqualTo(6)
        Assertions.assertThat(metrics.getFileMetricMap("sample_file.frm")?.getMetricValue("comment_lines")).isEqualTo(3)
    }
}