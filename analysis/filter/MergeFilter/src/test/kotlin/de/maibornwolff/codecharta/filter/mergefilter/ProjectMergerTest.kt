/*
 * Copyright (c) 2017, MaibornWolff GmbH
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 *  * Redistributions of source code must retain the above copyright notice,
 *    this list of conditions and the following disclaimer.
 *  * Redistributions in binary form must reproduce the above copyright
 *    notice, this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 *  * Neither the name of  nor the names of its contributors may be used to
 *    endorse or promote products derived from this software without specific
 *    prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

package de.maibornwolff.codecharta.filter.mergefilter

import de.maibornwolff.codecharta.model.Project
import de.maibornwolff.codecharta.model.ProjectMatcher
import de.maibornwolff.codecharta.serialization.ProjectDeserializer
import org.hamcrest.CoreMatchers
import org.hamcrest.MatcherAssert.assertThat
import org.jetbrains.spek.api.Spek
import org.jetbrains.spek.api.dsl.describe
import org.jetbrains.spek.api.dsl.it
import java.io.InputStreamReader
import kotlin.test.assertFailsWith

const val DEFAULT_API_VERSION = "1.0"

class ProjectMergerTest : Spek({
    describe("using a recursive node merger strategy") {
        val nodeMergerStrategy = RecursiveNodeMergerStrategy()

        describe("merging an project with unsupported API version") {
            val project = Project("project", apiVersion = "unsupported Version")

            it("should throw a exception") {
                assertFailsWith(MergeException::class) {
                    ProjectMerger(listOf(project), nodeMergerStrategy).merge()
                }
            }
        }

        describe("merging project with different names") {
            val projects = listOf(
                    Project("test1", apiVersion = DEFAULT_API_VERSION),
                    Project("test2", apiVersion = DEFAULT_API_VERSION)
            )

            it("should throw a exception") {
                assertFailsWith(MergeException::class) {
                    ProjectMerger(projects, nodeMergerStrategy).extractProjectName()
                }
            }
        }

        describe("merging project with different API versions") {
            val projectName = "test"
            val projects = listOf(
                    Project(projectName, apiVersion = "1.0"),
                    Project(projectName, apiVersion = "2.0")
            )

            it("should throw a exception") {
                ProjectMerger(projects, nodeMergerStrategy).extractProjectName()
            }
        }

        describe("merging projects with same name and API version") {
            val projectName = "test"
            val projects = listOf(
                    Project(projectName, apiVersion =  DEFAULT_API_VERSION),
                    Project(projectName, apiVersion =  DEFAULT_API_VERSION)
            )

            it("should extract project name") {
                val name = ProjectMerger(projects, nodeMergerStrategy).extractProjectName()
                assertThat(name, CoreMatchers.`is`(projectName))
            }
        }

        val TEST_JSON_FILE = "test.json"
        val TEST_JSON_FILE2 = "test2.json"

        describe("merging same project") {
            val inStream = this.javaClass.classLoader.getResourceAsStream(TEST_JSON_FILE)
            val originalProject = ProjectDeserializer.deserializeProject(InputStreamReader(inStream))
            val projectList = listOf(originalProject, originalProject)

            it("should return project") {
                val project = ProjectMerger(projectList, nodeMergerStrategy).merge()
                assertThat(project, ProjectMatcher.matchesProject(originalProject))
            }
        }

        describe("merging two projects") {
            val originalProject1 = ProjectDeserializer.deserializeProject(InputStreamReader(this.javaClass.classLoader.getResourceAsStream(TEST_JSON_FILE)))
            val originalProject2 = ProjectDeserializer.deserializeProject(InputStreamReader(this.javaClass.classLoader.getResourceAsStream(TEST_JSON_FILE2)))
            val projectList = listOf(originalProject1, originalProject2)

            it("should return different project") {
                val project = ProjectMerger(projectList, nodeMergerStrategy).merge()

                assertThat(project == originalProject1, CoreMatchers.`is`(false))
                assertThat(project == originalProject2, CoreMatchers.`is`(false))
            }
        }


    }
})
