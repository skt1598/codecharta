import "./threeViewer.module"
import { getService, instantiateModule } from "../../../../../mocks/ng.mockhelper"
import { ThreeOrbitControlsService } from "./threeOrbitControlsService"
import { ThreeCameraService } from "./threeCameraService"
import { ThreeSceneService } from "./threeSceneService"
import { IRootScopeService, ITimeoutService } from "angular"
import * as THREE from "three"
import { OrbitControls, PerspectiveCamera, Vector3 } from "three"
import { LoadingStatusService } from "../../../state/loadingStatus.service"
import { StoreService } from "../../../state/store.service"
import { FocusedNodePathService } from "../../../state/store/dynamicSettings/focusedNodePath/focusedNodePath.service"
import { setResetCameraIfNewFileIsLoaded } from "../../../state/store/appSettings/resetCameraIfNewFileIsLoaded/resetCameraIfNewFileIsLoaded.actions"

describe("ThreeOrbitControlsService", () => {
	let threeOrbitControlsService: ThreeOrbitControlsService
	let $rootScope: IRootScopeService
	let $timeout: ITimeoutService
	let storeService: StoreService
	let threeCameraService: ThreeCameraService
	let threeSceneService: ThreeSceneService
	let loadingStatusService: LoadingStatusService

	let vector: Vector3

	afterEach(() => {
		jest.resetAllMocks()
	})

	beforeEach(() => {
		restartSystem()
		rebuildService()
		withMockedThreeCameraService()
		withMockedThreeSceneService()
		withMockedControlService()
	})

	function restartSystem() {
		instantiateModule("app.codeCharta.ui.codeMap.threeViewer")

		$rootScope = getService<IRootScopeService>("$rootScope")
		$timeout = getService<ITimeoutService>("$timeout")
		storeService = getService<StoreService>("storeService")
		threeCameraService = getService<ThreeCameraService>("threeCameraService")
		threeSceneService = getService<ThreeSceneService>("threeSceneService")
		loadingStatusService = getService<LoadingStatusService>("loadingStatusService")

		vector = new Vector3(4.4577067775672665, 4.4577067775672665, 4.4577067775672665)
	}

	function withMockedThreeCameraService() {
		const camera = new PerspectiveCamera(100, 0, 0, 0)
		camera.position.set(vector.x, vector.y, vector.z)
		threeCameraService = threeOrbitControlsService["threeCameraService"] = jest.fn<ThreeCameraService>(() => {
			return {
				camera
			}
		})()
	}

	function withMockedThreeSceneService() {
		threeSceneService = threeOrbitControlsService["threeSceneService"] = jest.fn<ThreeSceneService>(() => {
			return {
				scene: {
					add: jest.fn(),
					remove: jest.fn()
				},
				mapGeometry: new THREE.Mesh(new THREE.BoxGeometry(10, 10, 10))
			}
		})()
	}

	function withMockedControlService() {
		threeOrbitControlsService.controls = {
			target: new THREE.Vector3(1, 1, 1)
		} as OrbitControls
		threeOrbitControlsService.controls.update = jest.fn()
	}

	function rebuildService() {
		threeOrbitControlsService = new ThreeOrbitControlsService(
			$rootScope,
			$timeout,
			storeService,
			threeCameraService,
			threeSceneService,
			loadingStatusService
		)
	}

	describe("constructor", () => {
		it("should subscribe to FocusedNodePathService focus", () => {
			FocusedNodePathService.subscribeToFocusNode = jest.fn()

			rebuildService()

			expect(FocusedNodePathService.subscribeToFocusNode).toHaveBeenCalledWith($rootScope, threeOrbitControlsService)
		})

		it("should subscribe to FocusedNodePathService unfocus", () => {
			FocusedNodePathService.subscribeToUnfocusNode = jest.fn()

			rebuildService()

			expect(FocusedNodePathService.subscribeToUnfocusNode).toHaveBeenCalledWith($rootScope, threeOrbitControlsService)
		})
	})

	describe("onFileStateChanged", () => {
		it("should autoFit when the option to do so is enabled", () => {
			threeOrbitControlsService.autoFitTo = jest.fn()

			storeService.dispatch(setResetCameraIfNewFileIsLoaded(true))

			threeOrbitControlsService.onFileStatesChanged(undefined)

			expect(threeOrbitControlsService.autoFitTo).toHaveBeenCalled()
		})

		it("should autoFit when the option to do so is enabled", () => {
			threeOrbitControlsService.autoFitTo = jest.fn()

			storeService.dispatch(setResetCameraIfNewFileIsLoaded(false))

			threeOrbitControlsService.onFileStatesChanged(undefined)

			expect(threeOrbitControlsService.autoFitTo).not.toHaveBeenCalled()
		})
	})

	it("rotateCameraInVectorDirection ", () => {
		threeOrbitControlsService.controls = {
			target: new THREE.Vector3(0, 0, 0)
		} as OrbitControls
		const vector = { x: 0, y: 1, z: 0 }

		threeOrbitControlsService.rotateCameraInVectorDirection(vector.x, vector.y, vector.z)

		expect(threeSceneService.scene.add).toBeCalled()
		expect(threeSceneService.scene.remove).toBeCalled()

		expect(threeCameraService.camera.position).toMatchSnapshot()
	})

	describe("onFocusedNode", () => {
		it("autoFitTo have to be", () => {
			threeOrbitControlsService.onFocusNode("something")
			$timeout.flush()

			expect(threeOrbitControlsService.controls.update).toBeCalled()
		})
	})

	describe("onUnfocusNode", () => {
		beforeEach(() => {
			threeOrbitControlsService.autoFitTo = jest.fn()
		})

		it("should call resetCamera, when map is not loading ", () => {
			loadingStatusService["isLoadingFile"] = false
			loadingStatusService["isLoadingMap"] = false

			threeOrbitControlsService.onUnfocusNode()

			expect(threeOrbitControlsService.autoFitTo).toBeCalled()
		})

		it("should not call resetCamera, when map is loading ", () => {
			loadingStatusService["isLoadingFile"] = true
			loadingStatusService["isLoadingMap"] = false

			threeOrbitControlsService.onUnfocusNode()

			expect(threeOrbitControlsService.autoFitTo).not.toHaveBeenCalled()
		})
	})

	describe("autoFitTo", () => {
		it("should auto fit map to its origin value ", () => {
			threeCameraService.camera.position.set(0, 0, 0)

			threeOrbitControlsService.autoFitTo()
			$timeout.flush()

			expect(threeCameraService.camera.position).toEqual(vector)
		})

		it("should call an control update", () => {
			threeCameraService.camera.lookAt = jest.fn()

			threeOrbitControlsService.autoFitTo()
			$timeout.flush()

			expect(threeCameraService.camera.lookAt).toBeCalledWith(threeOrbitControlsService.controls.target)
		})

		it("should auto fit map to its original value ", () => {
			threeCameraService.camera.updateProjectionMatrix = jest.fn()

			threeOrbitControlsService.autoFitTo()
			$timeout.flush()

			expect(threeOrbitControlsService.controls.update).toBeCalled()
			expect(threeCameraService.camera.updateProjectionMatrix).toBeCalled()
		})

		it("should set the defaultCameraPerspective to the auto fitted vector", () => {
			threeOrbitControlsService.defaultCameraPosition.set(0, 0, 0)

			threeOrbitControlsService.autoFitTo()
			$timeout.flush()

			expect(threeOrbitControlsService.defaultCameraPosition.x).toEqual(vector.x)
			expect(threeOrbitControlsService.defaultCameraPosition.y).toEqual(vector.y)
			expect(threeOrbitControlsService.defaultCameraPosition.z).toEqual(vector.z)
		})
	})
})
