import "./data.module";
import {NGMock} from "../../../ng.mockhelper";
import {DataService, DataServiceSubscriber} from "./data.service";
import {CodeMap} from "./model/CodeMap";
import {TEST_FILE_DATA} from "./data.mocks";

/**
 * @test {DataService}
 */
describe("app.codeCharta.core.data.dataService", function() {

    let data: CodeMap;
    let dataService: DataService;

    //noinspection TypeScriptUnresolvedVariable
    beforeEach(NGMock.mock.module("app.codeCharta.core.data"));

    //noinspection TypeScriptUnresolvedVariable
    beforeEach(NGMock.mock.inject(function (_dataService_) {
        dataService = _dataService_;
    }));

    beforeEach(function () {
        data = TEST_FILE_DATA;
    });

    /**
     * @test {DataService#constructor}
     */
    it("metrics should be empty when no file is loaded", () => {

        // system under test
        let sut = dataService;

        // assertion
        expect(sut.data.metrics.length).toBe(0);

    });

    it("should find all metrics, even in child nodes", () => {
        let sut = dataService;
        sut.setMap(data, 0);
        expect(sut.data.metrics.length).toBe(4);
    });

    it("should retrieve instance", () => {
        expect(dataService).not.toBe(undefined);
    });

    it("subscribe/notify", () => {

        let subscriber: DataServiceSubscriber = {
            onDataChanged: jest.fn();
        };

        dataService.subscribe(subscriber);

        dataService.data.metrics = ["HELLO"];
        dataService.notify();

        expect(subscriber.onDataChanged).toHaveBeenCalledWith({"metrics": ["HELLO"], "renderMap": null, "revisions": []}, expect.anything());

    });

    it("set metrics should set metrics correctly", ()=>{
        dataService.setMap(data, 0);
        dataService.setMetrics(0);
        expect(dataService.data.metrics).toEqual(["RLOC", "Functions", "MCC", "unary"]);
    });

    it("set metrics should not set metrics when map is null", ()=>{
        dataService.setMetrics(42);
        expect(dataService.data.metrics).toEqual([]);
    });

    it("resetting map should clear everything", () => {
        dataService.setMap(data, 0);
        dataService.setMap(data, 1);
        dataService.notify = jest.fn();
        dataService.resetMaps();
        expect(dataService.data.renderMap).toBe(null);
        expect(dataService._lastComparisonMap).toBe(null);
        expect(dataService.data.metrics).toEqual([]);
        expect(dataService.data.revisions).toEqual([]);
        expect(dataService.notify).toHaveBeenCalled();
    });

    it("setting a map should set it as render map and add the origin attribute", () => {
        dataService.setMap(data, 0);
        expect(dataService.data.renderMap.root.origin).toBe(dataService.data.renderMap.fileName);
    });

    it("setting a comparison map should do nothing if map at index does not exist", () => {
        dataService.setMap(data, 0);
        dataService.setComparisonMap(1);
        expect(dataService.data.renderMap.fileName).toBe(data.fileName);
    });

    it("setting a reference map should do nothing if map at index does not exist", () => {
        dataService.setMap(data, 0);
        dataService.setReferenceMap(1);
        expect(dataService.data.renderMap.fileName).toBe(data.fileName);
    });

    it("activating deltas when deltas are not enabled should set the flag and maps correctly", () => {
        dataService._lastReferenceIndex = 42;
        dataService._deltasEnabled = false;
        dataService.setComparisonMap = jest.fn();
        dataService.setReferenceMap = jest.fn();
        dataService.onActivateDeltas();
        expect(dataService._deltasEnabled).toBe(true);
        expect(dataService.setComparisonMap).toHaveBeenCalledWith(42);
        expect(dataService.setReferenceMap).toHaveBeenCalledWith(42);
    });

    it("activating deltas when deltas are enabled should do nothing", () => {
        dataService._lastReferenceIndex = 42;
        dataService._deltasEnabled = true;
        dataService.setComparisonMap = jest.fn();
        dataService.setReferenceMap = jest.fn();
        dataService.onActivateDeltas();
        expect(dataService._deltasEnabled).toBe(true);
        expect(dataService.setComparisonMap).not.toHaveBeenCalled();
        expect(dataService.setReferenceMap).not.toHaveBeenCalled();
    });

    it("deactivating deltas when deltas are enabled should set the flag and maps correctly", () => {
        dataService._lastReferenceIndex = 42;
        dataService._deltasEnabled = true;
        dataService.setComparisonMap = jest.fn();
        dataService.setReferenceMap = jest.fn();
        dataService.onDeactivateDeltas();
        expect(dataService._deltasEnabled).toBe(false);
        expect(dataService.setComparisonMap).toHaveBeenCalledWith(42);
        expect(dataService.setReferenceMap).toHaveBeenCalledWith(42);
    });

    it("deactivating deltas when deltas are not enabled should do nothing", () => {
        dataService._lastReferenceIndex = 42;
        dataService._deltasEnabled = false;
        dataService.setComparisonMap = jest.fn();
        dataService.setReferenceMap = jest.fn();
        dataService.onDeactivateDeltas();
        expect(dataService._deltasEnabled).toBe(false);
        expect(dataService.setComparisonMap).not.toHaveBeenCalled();
        expect(dataService.setReferenceMap).not.toHaveBeenCalled();
    });

    it("apply node merging should retrieve the fillMapsWithNonExistingNodesFromOtherMap result and decorate it with unaries and deltas. after that write it back as current maps", NGMock.mock.inject(function (_dataService_, _deltaCalculatorService_, _dataDecoratorService_) {
        _dataService_._data.renderMap = "OLD RENDER MAP";
        _dataService_._lastComparisonMap = "OLD COMPARISON MAP";

        _deltaCalculatorService_.fillMapsWithNonExistingNodesFromOtherMap = jest.fn();
        _deltaCalculatorService_.removeCrossOriginNodes = jest.fn();
        _deltaCalculatorService_.fillMapsWithNonExistingNodesFromOtherMap.mockReturnValue({leftMap: "LEFT MAP WITH OTHER NODES", rightMap:"RIGHT MAP WITH OTHER NODES"});
        _deltaCalculatorService_.removeCrossOriginNodes.mockReturnValue("MAP NO CROSS ORIGIN NODES");
        _dataDecoratorService_.decorateMapWithUnaryMetric = jest.fn();
        _deltaCalculatorService_.decorateMapsWithDeltas = jest.fn();

        _dataService_.applyNodeMerging();

        expect(_deltaCalculatorService_.fillMapsWithNonExistingNodesFromOtherMap).toHaveBeenCalledWith("MAP NO CROSS ORIGIN NODES", "MAP NO CROSS ORIGIN NODES");
        expect(_deltaCalculatorService_.removeCrossOriginNodes).toHaveBeenCalledWith("OLD RENDER MAP");
        expect(_deltaCalculatorService_.removeCrossOriginNodes).toHaveBeenCalledWith("OLD COMPARISON MAP");
        expect(_dataDecoratorService_.decorateMapWithUnaryMetric).toHaveBeenCalledWith("RIGHT MAP WITH OTHER NODES");
        expect(_dataDecoratorService_.decorateMapWithUnaryMetric).toHaveBeenCalledWith("LEFT MAP WITH OTHER NODES");
        expect(_deltaCalculatorService_.decorateMapsWithDeltas).toHaveBeenCalledWith("LEFT MAP WITH OTHER NODES", "OLD COMPARISON MAP");

    }));


});

