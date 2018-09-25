import "./aggregate.module";
import {NGMock} from "../../../../mocks/ng.mockhelper";
import {AttributeType, CodeMap} from "../data/model/CodeMap";


/**
 * @test {Aggregate}
 */
describe("app.codeCharta.core.aggregate", function() {

    const file1: CodeMap = {
        fileName: "file1",
        projectName: "Sample Project",
        root: {
            name: "root",
            type: "Folder",
            attributes: {},
            children: [
                {
                    name: "big leaf",
                    type: "File",
                    attributes: {"rloc": 100, "functions": 10, "mcc": 1},
                    link: "http://www.google.de"
                },
                {
                    name: "Parent Leaf",
                    type: "Folder",
                    attributes: {},
                    children: [
                        {
                            name: "other small leaf",
                            type: "File",
                            attributes: {"rloc": 70, "functions": 1000, "mcc": 10}
                        }
                    ]
                }
            ]
        }
    };

    const file2: CodeMap = {
        fileName: "file2",
        projectName: "Sample Project",
        root: {
            name: "root",
            type: "Folder",
            attributes: {},
            children: [
                {
                    name: "big leaf",
                    type: "File",
                    attributes: {"rloc": 200, "functions": 20, "mcc": 2},
                    link: "http://www.google.de"
                },
                {
                    name: "Parent Leaf",
                    type: "Folder",
                    attributes: {},
                    children: [
                        {
                            name: "small leaf",
                            type: "File",
                            attributes: {"rloc": 60, "functions": 200, "mcc": 200}
                        }
                    ]
                }
            ]
        }
    };

    const file_aggregation_two: CodeMap = {
        fileName: "Aggregation of following files: file1, file2",
        projectName: "Aggregation of following projects: Sample Project, Sample Project",
        root: {
            name: "root",
            type: "Folder",
            attributes: {},
            origin: "Aggregation of following files: file1, file2",
            visible: true,
            path: "/root",
            children: [
                {
                    name: "file1",
                    type: "Folder",
                    attributes: {},
                    children: [
                        {
                            name: "big leaf",
                            type: "File",
                            attributes: {"rloc": 100, "functions": 10, "mcc": 1},
                            link: "http://www.google.de"
                        },
                        {
                            name: "Parent Leaf",
                            type: "Folder",
                            attributes: {},
                            children: [
                                {
                                    name: "other small leaf",
                                    type: "File",
                                    attributes: {"rloc": 70, "functions": 1000, "mcc": 10}
                                }
                            ]
                        }
                    ]
                },
                {

                    name: "file2",
                    type: "Folder",
                    attributes: {},
                    children: [
                        {
                            name: "big leaf",
                            type: "File",
                            attributes: {"rloc": 200, "functions": 20, "mcc": 2},
                            link: "http://www.google.de"
                        },
                        {
                            name: "Parent Leaf",
                            type: "Folder",
                            attributes: {},
                            children: [
                                {
                                    name: "small leaf",
                                    type: "File",
                                    attributes: {"rloc": 60, "functions": 200, "mcc": 200}
                                }
                            ]
                        }
                    ]
                }

            ]
        }
    };

    const file_aggregation_four: CodeMap = {
        fileName: "Aggregation of following files: file1, file2, file1, file2",
        projectName: "Aggregation of following projects: Sample Project, Sample Project, Sample Project, Sample Project",
        root: {
            name: "root",
            type: "Folder",
            attributes: {},
            origin: "Aggregation of following files: file1, file2, file1, file2",
            visible: true,
            path: "/root",
            children: [{
                name: "file1",
                type: "Folder",
                attributes: {},
                children: [
                    {
                        name: "big leaf",
                        type: "File",
                        attributes: {"rloc": 100, "functions": 10, "mcc": 1},
                        link: "http://www.google.de"
                    },
                    {
                        name: "Parent Leaf",
                        type: "Folder",
                        attributes: {},
                        children: [
                            {
                                name: "other small leaf",
                                type: "File",
                                attributes: {"rloc": 70, "functions": 1000, "mcc": 10}
                            }
                        ]
                    }
                ]
            },
                {

                    name: "file2",
                    type: "Folder",
                    attributes: {},
                    children: [
                        {
                            name: "big leaf",
                            type: "File",
                            attributes: {"rloc": 200, "functions": 20, "mcc": 2},
                            link: "http://www.google.de"
                        },
                        {
                            name: "Parent Leaf",
                            type: "Folder",
                            attributes: {},
                            children: [
                                {
                                    name: "small leaf",
                                    type: "File",
                                    attributes: {"rloc": 60, "functions": 200, "mcc": 200}
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "file1",
                    type: "Folder",
                    attributes: {},
                    children: [
                        {
                            name: "big leaf",
                            type: "File",
                            attributes: {"rloc": 100, "functions": 10, "mcc": 1},
                            link: "http://www.google.de"
                        },
                        {
                            name: "Parent Leaf",
                            type: "Folder",
                            attributes: {},
                            children: [
                                {
                                    name: "other small leaf",
                                    type: "File",
                                    attributes: {"rloc": 70, "functions": 1000, "mcc": 10}
                                }
                            ]
                        }
                    ]
                },
                {

                    name: "file2",
                    type: "Folder",
                    attributes: {},
                    children: [
                        {
                            name: "big leaf",
                            type: "File",
                            attributes: {"rloc": 200, "functions": 20, "mcc": 2},
                            link: "http://www.google.de"
                        },
                        {
                            name: "Parent Leaf",
                            type: "Folder",
                            attributes: {},
                            children: [
                                {
                                    name: "small leaf",
                                    type: "File",
                                    attributes: {"rloc": 60, "functions": 200, "mcc": 200}
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    };

    beforeEach(NGMock.mock.module("app.codeCharta.core.aggregate"));

    describe("aggregateService", function() {

        /**
         * @test {aggregateMapService}
         */
        it("instance", NGMock.mock.inject(function (aggregateMapService) {
            expect(aggregateMapService).not.toBe(undefined);
        }));

        /**
         * @test {aggregateMapService}
         */
        it("aggregation of two maps", NGMock.mock.inject(function (aggregateMapService) {
            let aggregated: CodeMap;
            aggregated = aggregateMapService.aggregateMaps([file1, file2]);
            expect(aggregated).toEqual(file_aggregation_two);
        }));

        /**
         * @test {aggregateMapService}
         */
        it("aggregation of four maps", NGMock.mock.inject(function (aggregateMapService) {
            let aggregated: CodeMap;
            aggregated = aggregateMapService.aggregateMaps([file1, file2, file1, file2]);
            expect(aggregated).toEqual(file_aggregation_four);
        }));

        /**
         * @test {aggregateMapService}
         */
        it("aggregation one map", NGMock.mock.inject(function (aggregateMapService) {
            let aggregated: CodeMap;
            aggregated = aggregateMapService.aggregateMaps([file1]);
            expect(aggregated).toEqual(file1);
        }));
    });

    describe("edges", ()=> {

        const edges1 = [
            {
                "fromNodeName": "/root/big leaf",
                "toNodeName": "/root/Parent Leaf/small leaf",
                "attributes": {
                    "pairingRate": 9,
                    "avgCommits": 4
                }
            }
        ];

        const edges2 = [
            {
                "fromNodeName": "/root/big leaf",
                "toNodeName": "/root/Parent Leaf/small leaf",
                "attributes": {
                    "pairingRate": 89,
                    "avgCommits": 34
                }
            }
        ];

        const aggEdges = [
            {
                "fromNodeName": "/root/file1/big leaf",
                "toNodeName": "/root/file1/Parent Leaf/small leaf",
                "attributes": {
                    "pairingRate": 9,
                    "avgCommits": 4
                }
            },
            {
                "fromNodeName": "/root/file2/big leaf",
                "toNodeName": "/root/file2/Parent Leaf/small leaf",
                "attributes": {
                    "pairingRate": 89,
                    "avgCommits": 34
                }
            }
        ];

        /**
         * @test {aggregateMapService}
         */
        it ( "aggregation of two maps with empty edges should result in empty edges",NGMock.mock.inject(function(aggregateMapService){
            file1.edges = [];
            file2.edges = [];
            let aggregated: CodeMap = aggregateMapService.aggregateMaps([file1,file2]);
            expect(aggregated.edges).toEqual([]);
        }));

        /**
         * @test {aggregateMapService}
         */
        it ( "aggregation of two maps with given edges should result in summarized edges",NGMock.mock.inject(function(aggregateMapService){
            file1.edges = edges1;
            file2.edges = edges2;
            let aggregated = aggregateMapService.aggregateMaps([file1,file2]);
            expect(aggregated.edges).toEqual(aggEdges);
        }));

        /**
         * @test {aggregateMapService}
         */
        it ( "aggregation of one map with edges and other without should result in merged edges",NGMock.mock.inject(function(aggregateMapService){
            file1.edges = [edges1[0], edges2[0]];
            file2.edges = null;
            const expectedEdges = aggEdges;
            expectedEdges[1].fromNodeName = "/root/file1/big leaf";
            expectedEdges[1].toNodeName = "/root/file1/Parent Leaf/small leaf";
            let aggregated = aggregateMapService.aggregateMaps([file1,file2]);
            expect(aggregated.edges).toEqual(expectedEdges);
        }));

    });


    describe("AttributeTypes", ()=> {

         const attribute1 = {
            nodes: {
                ["key1"]: AttributeType.absolute
            },
            edges: {
                ["key2"]: AttributeType.relative
            }
         };

        const attribute_reverse1 = {
            nodes: {
                ["key1"]: AttributeType.relative

            },
            edges: {
                ["key2"]: AttributeType.absolute
            }
        };


        const attribute2 = {
            nodes: {
                ["key1_2"]: AttributeType.absolute
            },
            edges: {
                ["key2_2"]: AttributeType.relative
            }
        };


        const aggAttributes = {
            nodes: {
                ["key1"]: AttributeType.absolute,

                ["key1_2"]: AttributeType.absolute
            },
            edges: {
                ["key2"]: AttributeType.relative,

                ["key2_2"]: AttributeType.relative
            }
        };

        /**
         * @test {aggregateMapService}
         */
        it ( "aggregation of two maps with different key attributes should result in all keys aggregated map",NGMock.mock.inject(function(aggregateMapService){
            file1.attributeTypes = attribute1;
            file2.attributeTypes = attribute2;
            let aggregated = aggregateMapService.aggregateMaps([file1,file2]);
            expect(aggregated.attributeTypes).toEqual(aggAttributes);
        }));

        /**
         * @test {aggregateMapService}
         */
        it ( "aggregation of one map with attributes and other without should result in merged with same attributes as the one with them",NGMock.mock.inject(function(aggregateMapService){
            file1.attributeTypes = attribute1;
            file2.attributeTypes = {};
            let aggregated = aggregateMapService.aggregateMaps([file1,file2]);
            expect(aggregated.attributeTypes).toEqual(attribute1);
        }));

    });
});