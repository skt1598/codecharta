import {NGMock} from "../../../ng.mockhelper.ts";
import DoneCallback = jest.DoneCallback;
import {IRootScopeService, IAngularEvent} from "angular";

import "./tooltip.module.ts";
import {
    TooltipService, Tooltips, TooltipServiceSubscriber, TOOLTIPS_CHANGED_EVENT_ID, NO_DESCRIPTION
} from "./tooltip.service.ts";

describe("tooltip.service", ()=> {

    let tooltipService: TooltipService;
    let $rootScope: IRootScopeService;

    //noinspection TypeScriptUnresolvedVariable
    beforeEach(NGMock.mock.module("app.codeCharta.core.tooltip"));

    //noinspection TypeScriptUnresolvedVariable
    beforeEach(NGMock.mock.inject((_tooltipService_, _$rootScope_)=> {
        tooltipService = _tooltipService_;
        $rootScope = _$rootScope_;
    }));

    it("setting tooltips broadcasts the correct angular event", (done)=> {

        let values: Tooltips = {
            a: "a",
            b: "b"
        };

        $rootScope.$on(TOOLTIPS_CHANGED_EVENT_ID, (event: IAngularEvent, tooltips: Tooltips) => {
            expect(tooltips).toBe(values);
            done();
        });

        tooltipService.tooltips = values;

    });

    it("setting tooltips notifies subscriber", (done)=> {

        let values: Tooltips = {
            a: "a",
            b: "b"
        };

        let subscriber: TooltipServiceSubscriber = {
            onTooltipsChanged: (tooltips: Tooltips, event: Event) => {
                expect(tooltips).toBe(values);
                done();
            }
        };

        tooltipService.subscribe(subscriber);
        tooltipService.tooltips = values;

    });

    it("default tooltips should be tooltips from json file", ()=> {
        expect(tooltipService.tooltips).toBe(require("./tooltips.json"));
    });

    it("Should return the correct description of the given metric", () => {
        tooltipService.tooltips = {a: "a description"};
        expect(tooltipService.getTooltipTextByKey("a")).toBe("a description");
    });

    it("Should return no description when the key is not a correct already known key", () => {
        expect(tooltipService.getTooltipTextByKey("")).toBe(NO_DESCRIPTION);
        expect(tooltipService.getTooltipTextByKey(null)).toBe(NO_DESCRIPTION);
        expect(tooltipService.getTooltipTextByKey(undefined)).toBe(NO_DESCRIPTION);
    });

    it("should return nested answer by keys in keys sorrounded by _", () => {
        tooltipService.tooltips = {a: "a description", c: "c description _a_"};
        expect(tooltipService.getTooltipTextByKey("c")).toBe("c description a description");
    });

    it("should return nested \"no description\" by unknown keys in keys sorrounded by _", () => {
        tooltipService.tooltips = {d: "d description _as_"};
        expect(tooltipService.getTooltipTextByKey("d")).toBe("d description " + NO_DESCRIPTION);
    });

    it("should return nested into nested descriptions", () => {
        tooltipService.tooltips = {a: "a description", c: "c description _a_", e: "nested descriptions _c_"};
        expect(tooltipService.getTooltipTextByKey("e")).toBe("nested descriptions c description a description");
    });

});