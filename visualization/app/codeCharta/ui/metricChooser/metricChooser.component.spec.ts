import "./metricChooser.module"

import { MetricChooserController } from "./metricChooser.component"
import { getService, instantiateModule } from "../../../../mocks/ng.mockhelper"
import { IRootScopeService, ITimeoutService } from "angular"
import { DEFAULT_STATE, STATE } from "../../util/dataMocks"
import { MetricService } from "../../state/metric.service"
import { StoreService } from "../../state/store.service"
import { AreaMetricService } from "../../state/store/dynamicSettings/areaMetric/areaMetric.service"
import { HeightMetricService } from "../../state/store/dynamicSettings/heightMetric/heightMetric.service"
import { ColorMetricService } from "../../state/store/dynamicSettings/colorMetric/colorMetric.service"
import { DistributionMetricService } from "../../state/store/dynamicSettings/distributionMetric/distributionMetric.service"
import { setDynamicMargin } from "../../state/store/appSettings/dynamicMargin/dynamicMargin.actions"
import { setMargin } from "../../state/store/dynamicSettings/margin/margin.actions"
import { setDynamicSettings } from "../../state/store/dynamicSettings/dynamicSettings.actions"
import { MetricData } from "../../codeCharta.model"

describe("MetricChooserController", () => {
	let metricChooserController: MetricChooserController
	let $rootScope: IRootScopeService
	let $timeout: ITimeoutService
	let storeService: StoreService
	let metricService: MetricService

	function rebuildController() {
		metricChooserController = new MetricChooserController($rootScope, $timeout, storeService, metricService)
	}

	function restartSystem() {
		instantiateModule("app.codeCharta.ui.metricChooser")

		$rootScope = getService<IRootScopeService>("$rootScope")
		$timeout = getService<ITimeoutService>("$timeout")
		storeService = getService<StoreService>("storeService")
		metricService = getService<MetricService>("metricService")
	}

	beforeEach(() => {
		restartSystem()
		rebuildController()
	})

	function withMockedMetricService(metricData) {
		metricService = metricChooserController["metricService"] = jest.fn().mockReturnValue({
			getMetricData: jest.fn().mockReturnValue(metricData)
		})()
	}

	function setMetricData(metricData: MetricData[]) {
		metricChooserController["originalMetricData"] = metricData
		metricChooserController["_viewModel"].metricData = metricData
	}

	describe("constructor", () => {
		it("should subscribe to AreaMetricService", () => {
			AreaMetricService.subscribe = jest.fn()

			rebuildController()

			expect(AreaMetricService.subscribe).toHaveBeenCalledWith($rootScope, metricChooserController)
		})

		it("should subscribe to HeightMetricService", () => {
			HeightMetricService.subscribe = jest.fn()

			rebuildController()

			expect(HeightMetricService.subscribe).toHaveBeenCalledWith($rootScope, metricChooserController)
		})

		it("should subscribe to ColorMetricService", () => {
			ColorMetricService.subscribe = jest.fn()

			rebuildController()

			expect(ColorMetricService.subscribe).toHaveBeenCalledWith($rootScope, metricChooserController)
		})

		it("should subscribe to DistributionMetricService", () => {
			DistributionMetricService.subscribe = jest.fn()

			rebuildController()

			expect(DistributionMetricService.subscribe).toHaveBeenCalledWith($rootScope, metricChooserController)
		})

		it("should subscribe to MetricService", () => {
			MetricService.subscribe = jest.fn()

			rebuildController()

			expect(MetricService.subscribe).toHaveBeenCalledWith($rootScope, metricChooserController)
		})
	})

	describe("onAreaMetricChanged", () => {
		it("should update the viewModel", () => {
			metricChooserController.onAreaMetricChanged("rloc")

			expect(metricChooserController["_viewModel"].areaMetric).toEqual("rloc")
		})
	})

	describe("onHeightMetricChanged", () => {
		it("should update the viewModel", () => {
			metricChooserController.onHeightMetricChanged("rloc")

			expect(metricChooserController["_viewModel"].heightMetric).toEqual("rloc")
		})
	})

	describe("onColorMetricChanged", () => {
		it("should update the viewModel", () => {
			metricChooserController.onColorMetricChanged("rloc")

			expect(metricChooserController["_viewModel"].colorMetric).toEqual("rloc")
		})
	})

	describe("onDistributionMetricChanged", () => {
		it("should update the viewModel", () => {
			metricChooserController.onDistributionMetricChanged("rloc")

			expect(metricChooserController["_viewModel"].distributionMetric).toEqual("rloc")
		})
	})

	describe("onMetricDataAdded", () => {
		it("metric data should be updated", () => {
			const metricData = [
				{ name: "a", maxValue: 1, availableInVisibleMaps: true },
				{ name: "b", maxValue: 2, availableInVisibleMaps: false }
			]
			withMockedMetricService(metricData)

			metricChooserController.onMetricDataAdded(metricData)

			expect(metricChooserController["_viewModel"].metricData).toEqual(metricData)
		})

		it("store is updated if selected metrics are not available", () => {
			const metricData = [
				{ name: "a", maxValue: 1, availableInVisibleMaps: true },
				{ name: "b", maxValue: 2, availableInVisibleMaps: true },
				{ name: "c", maxValue: 2, availableInVisibleMaps: true },
				{ name: "d", maxValue: 2, availableInVisibleMaps: true }
			]
			withMockedMetricService(metricData)

			metricChooserController.onMetricDataAdded(metricData)

			expect(storeService.getState().dynamicSettings.areaMetric).toEqual("a")
			expect(storeService.getState().dynamicSettings.colorMetric).toEqual("c")
			expect(storeService.getState().dynamicSettings.heightMetric).toEqual("b")
			expect(storeService.getState().dynamicSettings.distributionMetric).toEqual("a")
		})

		it("same metric is selected multiple times if less than 3 metrics available", () => {
			const metricData = [
				{ name: "a", maxValue: 1, availableInVisibleMaps: true },
				{ name: "b", maxValue: 1, availableInVisibleMaps: false }
			]
			withMockedMetricService(metricData)

			metricChooserController.onMetricDataAdded(metricData)

			expect(storeService.getState().dynamicSettings.areaMetric).toEqual("a")
			expect(storeService.getState().dynamicSettings.colorMetric).toEqual("a")
			expect(storeService.getState().dynamicSettings.heightMetric).toEqual("a")
			expect(storeService.getState().dynamicSettings.distributionMetric).toEqual("a")
		})

		it("settings are not updated if selected metrics are available", () => {
			storeService.dispatch(setDynamicSettings(STATE.dynamicSettings))
			const metricData = [
				{ name: "mcc", maxValue: 1, availableInVisibleMaps: true },
				{ name: "rloc", maxValue: 2, availableInVisibleMaps: true }
			]
			withMockedMetricService(metricData)

			metricChooserController.onMetricDataAdded(metricData)

			expect(storeService.getState().dynamicSettings).toEqual(STATE.dynamicSettings)
		})

		it("no metrics available, should not update settings", () => {
			const metricData = [{ name: "b", maxValue: 2, availableInVisibleMaps: false }]
			withMockedMetricService(metricData)

			metricChooserController.onMetricDataAdded(metricData)

			expect(storeService.getState()).toEqual(DEFAULT_STATE)
		})
	})

	describe("applySettingsAreaMetric", () => {
		it("should updateSettings with areaMetric and margin null, when dynamicMargin is enabled", () => {
			metricChooserController["_viewModel"].areaMetric = "mcc"

			metricChooserController.applySettingsAreaMetric()

			expect(storeService.getState().dynamicSettings.areaMetric).toEqual("mcc")
			expect(storeService.getState().dynamicSettings.margin).toBeNull()
		})

		it("should updateSettings with areaMetric and margin from settings, when dynamicMargin is disabled", () => {
			storeService.dispatch(setDynamicMargin(false))
			storeService.dispatch(setMargin(20))
			metricChooserController["_viewModel"].areaMetric = "mcc"

			metricChooserController.applySettingsAreaMetric()

			expect(storeService.getState().dynamicSettings.areaMetric).toEqual("mcc")
			expect(storeService.getState().dynamicSettings.margin).toBe(20)
		})
	})

	describe("applySettingsColorMetric", () => {
		it("should update color metric settings", () => {
			metricChooserController["_viewModel"].colorMetric = "c"

			metricChooserController.applySettingsColorMetric()

			expect(storeService.getState().dynamicSettings.colorMetric).toEqual("c")
		})
	})

	describe("applySettingsHeightMetric", () => {
		it("should update height metric settings", () => {
			metricChooserController["_viewModel"].heightMetric = "b"

			metricChooserController.applySettingsHeightMetric()

			expect(storeService.getState().dynamicSettings.heightMetric).toEqual("b")
		})
	})

	describe("applySettingsDistributionMetric", () => {
		it("should update distribution metric  settings", () => {
			metricChooserController["_viewModel"].distributionMetric = "d"

			metricChooserController.applySettingsDistributionMetric()

			expect(storeService.getState().dynamicSettings.distributionMetric).toEqual("d")
		})
	})

	describe("filterMetricData", () => {
		it("should return the default MetricData list", () => {
			const metricData = [
				{ name: "rloc", maxValue: 1, availableInVisibleMaps: true },
				{ name: "mcc", maxValue: 2, availableInVisibleMaps: false }
			]
			setMetricData(metricData)
			metricChooserController["_viewModel"].searchTerm = ""

			metricChooserController.filterMetricData()

			expect(metricChooserController["_viewModel"].metricData).toEqual(metricData)
		})
		it("should return only metric mcc from MetricData list, when its the searchTerm", () => {
			const metricData = [
				{ name: "rloc", maxValue: 1, availableInVisibleMaps: true },
				{ name: "mcc", maxValue: 2, availableInVisibleMaps: false }
			]
			setMetricData(metricData)
			metricChooserController["_viewModel"].searchTerm = "mcc"

			metricChooserController.filterMetricData()

			expect(metricChooserController["_viewModel"].metricData).toEqual([{ name: "mcc", maxValue: 2, availableInVisibleMaps: false }])
		})

		it("should return rloc metric when searchTerm is only 'rl'", () => {
			const metricData = [
				{ name: "rloc", maxValue: 1, availableInVisibleMaps: true },
				{ name: "mcc", maxValue: 2, availableInVisibleMaps: false }
			]
			setMetricData(metricData)
			metricChooserController["_viewModel"].searchTerm = "rl"

			metricChooserController.filterMetricData()

			expect(metricChooserController["_viewModel"].metricData).toEqual([{ name: "rloc", maxValue: 1, availableInVisibleMaps: true }])
		})

		it("should return the metrics which contains the metrics with 'c' in it", () => {
			const metricData = [
				{ name: "rloc", maxValue: 1, availableInVisibleMaps: true },
				{ name: "mcc", maxValue: 2, availableInVisibleMaps: false },
				{ name: "avg", maxValue: 3, availableInVisibleMaps: false }
			]
			setMetricData(metricData)
			metricChooserController["_viewModel"].searchTerm = "c"

			metricChooserController.filterMetricData()

			expect(metricChooserController["_viewModel"].metricData).toEqual([
				{ name: "rloc", maxValue: 1, availableInVisibleMaps: true },
				{ name: "mcc", maxValue: 2, availableInVisibleMaps: false }
			])
		})

		it("should return the metrics which contains substrings with 'mc' as prefix", () => {
			const metricData = [
				{ name: "rloc", maxValue: 1, availableInVisibleMaps: true },
				{ name: "mcc", maxValue: 2, availableInVisibleMaps: false },
				{ name: "avg", maxValue: 3, availableInVisibleMaps: false },
				{ name: "cmc", maxValue: 4, availableInVisibleMaps: true }
			]
			setMetricData(metricData)
			metricChooserController["_viewModel"].searchTerm = "mc"

			metricChooserController.filterMetricData()

			expect(metricChooserController["_viewModel"].metricData).toEqual([
				{ name: "mcc", maxValue: 2, availableInVisibleMaps: false },
				{ name: "cmc", maxValue: 4, availableInVisibleMaps: true }
			])
		})
		it("should return an empty metric list if it doesn't have the searchTerm as substring", () => {
			const metricData = [
				{ name: "rloc", maxValue: 1, availableInVisibleMaps: true },
				{ name: "mcc", maxValue: 2, availableInVisibleMaps: false },
				{ name: "avg", maxValue: 3, availableInVisibleMaps: false },
				{ name: "cmc", maxValue: 4, availableInVisibleMaps: true }
			]
			setMetricData(metricData)
			metricChooserController["_viewModel"].searchTerm = "rla"

			metricChooserController.filterMetricData()

			expect(metricChooserController["_viewModel"].metricData).toEqual([])
		})
	})

	describe("clearSearchTerm", () => {
		it("should return an empty string, when function is called", () => {
			metricChooserController["_viewModel"].searchTerm = "someString"

			metricChooserController.clearSearchTerm()

			expect(metricChooserController["_viewModel"].searchTerm).toEqual("")
		})

		it("should return the metricData array with all elements, when function is called", () => {
			const metricData = [
				{ name: "rloc", maxValue: 1, availableInVisibleMaps: true },
				{ name: "mcc", maxValue: 2, availableInVisibleMaps: false },
				{ name: "avg", maxValue: 3, availableInVisibleMaps: false },
				{ name: "cmc", maxValue: 4, availableInVisibleMaps: true }
			]
			setMetricData(metricData)
			metricChooserController["_viewModel"].searchTerm = "rlo"

			metricChooserController.clearSearchTerm()

			expect(metricChooserController["_viewModel"].metricData).toEqual(metricData)
		})
	})
})
