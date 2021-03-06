import "./metricType.module"
import { MetricTypeController } from "./metricType.component"
import { getService, instantiateModule } from "../../../../mocks/ng.mockhelper"
import { MetricService } from "../../state/metric.service"
import { IRootScopeService } from "angular"
import { AttributeTypeValue } from "../../codeCharta.model"
import { CodeMapBuilding } from "../codeMap/rendering/codeMapBuilding"
import { CodeMapMouseEventService } from "../codeMap/codeMap.mouseEvent.service"
import { StoreService } from "../../state/store.service"
import { AreaMetricService } from "../../state/store/dynamicSettings/areaMetric/areaMetric.service"
import { HeightMetricService } from "../../state/store/dynamicSettings/heightMetric/heightMetric.service"
import { ColorMetricService } from "../../state/store/dynamicSettings/colorMetric/colorMetric.service"
import { setAttributeTypes } from "../../state/store/fileSettings/attributeTypes/attributeTypes.actions"

describe("MetricTypeController", () => {
	let metricTypeController: MetricTypeController
	let $rootScope: IRootScopeService
	let metricService: MetricService
	let storeService: StoreService

	beforeEach(() => {
		restartSystem()
		rebuildController()
	})

	function restartSystem() {
		instantiateModule("app.codeCharta.ui.metricType")

		$rootScope = getService<IRootScopeService>("$rootScope")
		metricService = getService<MetricService>("metricService")
		storeService = getService<StoreService>("storeService")
	}

	function rebuildController() {
		metricTypeController = new MetricTypeController($rootScope, metricService, storeService)
	}

	describe("constructor", () => {
		beforeEach(() => {
			AreaMetricService.subscribe = jest.fn()
			HeightMetricService.subscribe = jest.fn()
			ColorMetricService.subscribe = jest.fn()
			CodeMapMouseEventService.subscribeToBuildingHovered = jest.fn()
			CodeMapMouseEventService.subscribeToBuildingUnhovered = jest.fn()
		})

		it("should subscribe to Metric-Events", () => {
			rebuildController()

			expect(AreaMetricService.subscribe).toHaveBeenCalledWith($rootScope, metricTypeController)
			expect(HeightMetricService.subscribe).toHaveBeenCalledWith($rootScope, metricTypeController)
			expect(ColorMetricService.subscribe).toHaveBeenCalledWith($rootScope, metricTypeController)
		})

		it("should subscribe to CodeMapMouseEventService", () => {
			rebuildController()

			expect(CodeMapMouseEventService.subscribeToBuildingHovered).toHaveBeenCalledWith($rootScope, metricTypeController)
			expect(CodeMapMouseEventService.subscribeToBuildingUnhovered).toHaveBeenCalledWith($rootScope, metricTypeController)
		})
	})

	describe("onAreaMetricChanged", () => {
		it("should set the areaMetricType to absolute", () => {
			storeService.dispatch(setAttributeTypes({ nodes: [{ rloc: AttributeTypeValue.absolute }], edges: [] }))

			metricTypeController.onAreaMetricChanged("rloc")

			expect(metricTypeController["_viewModel"].areaMetricType).toBe(AttributeTypeValue.absolute)
		})
	})

	describe("onHeightMetricChanged", () => {
		it("should set the heightMetricType to absolute", () => {
			storeService.dispatch(setAttributeTypes({ nodes: [{ mcc: AttributeTypeValue.absolute }], edges: [] }))

			metricTypeController.onHeightMetricChanged("mcc")

			expect(metricTypeController["_viewModel"].heightMetricType).toBe(AttributeTypeValue.absolute)
		})
	})

	describe("onColorMetricChanged", () => {
		it("should set the colorMetricType to relative", () => {
			storeService.dispatch(setAttributeTypes({ nodes: [{ coverage: AttributeTypeValue.relative }], edges: [] }))

			metricTypeController.onColorMetricChanged("coverage")

			expect(metricTypeController["_viewModel"].colorMetricType).toBe(AttributeTypeValue.relative)
		})
	})

	describe("isAreaMetricAbsolute", () => {
		it("should return true if areaMetric is absolute", () => {
			metricTypeController["_viewModel"].areaMetricType = AttributeTypeValue.absolute

			const actual = metricTypeController.isAreaMetricAbsolute()

			expect(actual).toBeTruthy()
		})

		it("should return true if areaMetric is null", () => {
			metricTypeController["_viewModel"].colorMetricType = null

			const actual = metricTypeController.isColorMetricAbsolute()

			expect(actual).toBeTruthy()
		})

		it("should return false if areaMetric is relative", () => {
			metricTypeController["_viewModel"].areaMetricType = AttributeTypeValue.relative

			const actual = metricTypeController.isAreaMetricAbsolute()

			expect(actual).toBeFalsy()
		})
	})

	describe("isHeightMetricAbsolute", () => {
		it("should return true if areaMetric is absolute", () => {
			metricTypeController["_viewModel"].heightMetricType = AttributeTypeValue.absolute

			const actual = metricTypeController.isHeightMetricAbsolute()

			expect(actual).toBeTruthy()
		})

		it("should return true if heightMetric is null", () => {
			metricTypeController["_viewModel"].colorMetricType = null

			const actual = metricTypeController.isColorMetricAbsolute()

			expect(actual).toBeTruthy()
		})

		it("should return false if heightMetric is relative", () => {
			metricTypeController["_viewModel"].heightMetricType = AttributeTypeValue.relative

			const actual = metricTypeController.isHeightMetricAbsolute()

			expect(actual).toBeFalsy()
		})
	})

	describe("isColorMetricAbsolute", () => {
		it("should return true if colorMetric is absolute", () => {
			metricTypeController["_viewModel"].colorMetricType = AttributeTypeValue.absolute

			const actual = metricTypeController.isColorMetricAbsolute()

			expect(actual).toBeTruthy()
		})

		it("should return true if colorMetric is null", () => {
			metricTypeController["_viewModel"].colorMetricType = null

			const actual = metricTypeController.isColorMetricAbsolute()

			expect(actual).toBeTruthy()
		})

		it("should return false if colorMetric is relative", () => {
			metricTypeController["_viewModel"].colorMetricType = AttributeTypeValue.relative

			const actual = metricTypeController.isColorMetricAbsolute()

			expect(actual).toBeFalsy()
		})
	})

	describe("onBuildingHovered", () => {
		it("should set isBuildingHovered to true", () => {
			metricTypeController.onBuildingHovered({ node: { isLeaf: false } } as CodeMapBuilding)

			expect(metricTypeController["_viewModel"].isBuildingHovered).toBeTruthy()
		})

		it("should not set isBuildingHovered to true if building is a leaf", () => {
			metricTypeController.onBuildingHovered({
				node: { isLeaf: true }
			} as CodeMapBuilding)

			expect(metricTypeController["_viewModel"].isBuildingHovered).toBeFalsy()
		})

		it("should set isBuildingHovered to true when going from a folder to another folder", () => {
			metricTypeController.onBuildingHovered({
				node: { isLeaf: false }
			} as CodeMapBuilding)

			expect(metricTypeController["_viewModel"].isBuildingHovered).toBeTruthy()
		})

		it("should set isBuildingHovered to false when going from a folder to leaf", () => {
			metricTypeController.onBuildingHovered({
				node: { isLeaf: false }
			} as CodeMapBuilding)

			metricTypeController.onBuildingHovered({
				node: { isLeaf: true }
			} as CodeMapBuilding)

			expect(metricTypeController["_viewModel"].isBuildingHovered).toBeFalsy()
		})
	})

	describe("onBuildingUnhovered", () => {
		it("should set isBuildingHovered to false", () => {
			metricTypeController.onBuildingUnhovered()

			expect(metricTypeController["_viewModel"].isBuildingHovered).toBeFalsy()
		})
	})
})
