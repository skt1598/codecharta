package de.maibornwolff.codecharta.model

data class AttributeTypes(
        val attributeTypes: MutableMap<String, AttributeType> = mutableMapOf(),
        val type: String = "") {

    fun add(metricName: String, attributeType: AttributeType) {
        attributeTypes[metricName] = attributeType
    }
}