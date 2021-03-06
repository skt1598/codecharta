package de.maibornwolff.codecharta.filter.mergefilter

import de.maibornwolff.codecharta.model.*
import mu.KotlinLogging

class ProjectMerger(private val projects: List<Project>, private val nodeMerger: NodeMergerStrategy) {

    private val logger = KotlinLogging.logger { }

    fun merge(): Project {
        return when {
            areAllAPIVersionsCompatible() -> ProjectBuilder(
                    mergeProjectNodes(),
                    mergeEdges(),
                    mergeAttributeTypes(),
                    mergeBlacklist()
            ).build()
            else                          -> throw MergeException("API versions not supported.")
        }
    }

    private fun areAllAPIVersionsCompatible(): Boolean {
        val unsupportedAPIVersions = projects
                .map { it.apiVersion }
                .filter { !Project.isAPIVersionCompatible(it) }

        return unsupportedAPIVersions.isEmpty()
    }

    private fun mergeProjectNodes(): List<MutableNode> {
        val mergedNodes = nodeMerger.mergeNodeLists(projects.map { listOf(it.rootNode.toMutableNode()) })
        nodeMerger.logMergeStats()
        return mergedNodes
    }

    private fun mergeEdges(): MutableList<Edge> {
        return if (nodeMerger.javaClass.simpleName == "RecursiveNodeMergerStrategy") {
            getMergedEdges()
        } else {
            getEdgesOfMasterAndWarnIfDiscards()
        }
    }

    private fun getEdgesOfMasterAndWarnIfDiscards(): MutableList<Edge> {
        projects.forEachIndexed { i, project ->
            if (project.edges.isNotEmpty() && i > 0) logger.warn("Edges were not merged. Use recursive strategy to merge edges.")
        }
        return projects.first().edges.toMutableList()
    }

    private fun getMergedEdges(): MutableList<Edge> {
        val mergedEdges = mutableListOf<Edge>()
        projects.forEach { it.edges.forEach { mergedEdges.add(it) } }
        return mergedEdges.distinctBy { listOf(it.fromNodeName, it.toNodeName) }.toMutableList()
    }

    private fun mergeAttributeTypes(): MutableMap<String, MutableList<Map<String, AttributeType>>> {
        val mergedAttributeTypes: MutableMap<String, MutableList<Map<String, AttributeType>>> = mutableMapOf()

        projects.forEach {
            it.attributeTypes.forEach {
                val key: String = it.key
                if (mergedAttributeTypes.containsKey(key)) {
                    it.value.forEach {
                        if (!mergedAttributeTypes[key]!!.contains(it)) {
                            mergedAttributeTypes[key]!!.add(it)
                        }
                    }
                } else {
                    mergedAttributeTypes[key] = it.value.toMutableList()
                }
            }
        }
        return mergedAttributeTypes
    }

    private fun mergeBlacklist(): MutableList<BlacklistItem> {
        val mergedBlacklist = mutableListOf<BlacklistItem>()
        projects.forEach { it.blacklist.forEach { mergedBlacklist.add(it) } }
        return mergedBlacklist.distinctBy { it.toString() }.toMutableList()
    }
}