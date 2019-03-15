import {FileValidator} from "./fileValidator";
import {TEST_FILE_CONTENT} from "./dataMocks";

describe("app.codeCharta.util.fileValidator", function () {

    let file;

    beforeEach(()=> {
        file = TEST_FILE_CONTENT;
    });

    function expectFileToBeValid(errors) {
        expect(errors.length).toBe(0)
    }

    function expectFileToBeInvalid(errors) {
        expect(errors.length).toBeGreaterThan(0)
    }

    it("should reject null", ()=> {
        const errors = FileValidator.validate(null)
        expectFileToBeInvalid(errors)
    });

    it("should reject string", ()=> {
        const errors = FileValidator.validate("" as any);
        expectFileToBeInvalid(errors)
    });

    it("should not reject a file with edges", () => {
        file.edges = [
            {
                fromNodeName: "a",
                toNodeName: "b",
                attributes: {
                    avgCommits: 42,
                    pairingRate: 80,
                },
                visible: false
            }
        ];
        const errors = FileValidator.validate(file);
        expectFileToBeValid(errors)
    });

    it("should not reject a file without edges", ()=> {
        file.settings.fileSettings.edges = undefined;
        const errors = FileValidator.validate(file);
        expectFileToBeValid(errors)
    });

    it("should not reject a file when numbers are floating point values", ()=> {
        file.map.children[0].attributes["RLOC"] = 333.4;
        const errors = FileValidator.validate(file);
        expectFileToBeValid(errors)
    });

    it("should reject when children are not unique in name+type", ()=> {
        file.map.children[0].name = "same";
        file.map.children[0].type = "File";
        file.map.children[1].name = "same";
        file.map.children[1].type = "File";
        const errors = FileValidator.validate(file);
        expectFileToBeInvalid(errors)
    });

    it("should reject when nodes are empty", ()=> {
        file.map = [];
        const errors = FileValidator.validate(file);
        expectFileToBeInvalid(errors)
    });

    it("should reject if nodes is not a node and therefore has no name or id", ()=> {
        file.map = {
            something: "something"
        };
        const errors = FileValidator.validate(file);
        expectFileToBeInvalid(errors)
    });

    it("attributes should not allow whitespaces", ()=> {
        file.map.attributes = {
            "tes t1": 0
        };
        const errors = FileValidator.validate(file);
        expectFileToBeInvalid(errors)
    });

    it("attributes should not allow special characters", ()=> {
        file.map.attributes = {
            "tes)t1": 0
        };

        const errors = FileValidator.validate(file);
        expectFileToBeInvalid(errors)
    });

});

