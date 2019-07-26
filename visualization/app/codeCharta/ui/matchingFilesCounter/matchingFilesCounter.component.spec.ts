import "./matchingFilesCounter.module"
import { MatchingFilesCounterController } from "./matchingFilesCounter.component"
import { instantiateModule, getService } from "../../../../mocks/ng.mockhelper"
import { CodeMapPreRenderService } from "../codeMap/codeMap.preRender.service"
import { VALID_NODE_WITH_PATH, SETTINGS, TEST_FILE_WITH_PATHS } from "../../util/dataMocks"
import { CodeMapNode, BlacklistItem, BlacklistType, RecursivePartial, Settings } from "../../codeCharta.model"
import { CodeMapHelper } from "../../util/codeMapHelper"
import { IRootScopeService } from "angular"

describe("MatchingFilesCounterController", () => {
	let matchingFilesCounterController: MatchingFilesCounterController
	let codeMapPreRenderService: CodeMapPreRenderService
	let $rootScope: IRootScopeService

	beforeEach(() => {
		restartSystem()
		rebuildController()
		withMockedCodeMapPreRenderService()
	})

	function restartSystem() {
		instantiateModule("app.codeCharta.ui.matchingFilesCounter")
		$rootScope = getService<IRootScopeService>("$rootScope")
		codeMapPreRenderService = getService<CodeMapPreRenderService>("codeMapPreRenderService")
	}

	function rebuildController() {
		matchingFilesCounterController = new MatchingFilesCounterController($rootScope)
	}

	function withMockedCodeMapPreRenderService() {
		codeMapPreRenderService["lastRender"].renderFile = TEST_FILE_WITH_PATHS
	}

	describe("onSettingsChanged", () => {
		it("should update search pattern", () => {
			const blacklist: BlacklistItem[] = [{ path: "/root/node/path", type: BlacklistType.exclude }]
			SETTINGS.fileSettings.blacklist = blacklist
			let update = { fileSettings: { blacklist: blacklist } }

			matchingFilesCounterController.onSettingsChanged(SETTINGS, update, null)

			expect(matchingFilesCounterController["_viewModel"].blacklist).toBe(blacklist)
		})
	})

	describe("updateViewModel", () => {
		let searchedNodeLeaves: CodeMapNode[]
		let rootNode = VALID_NODE_WITH_PATH

		it("should update ViewModel count Attributes when pattern hidden and excluded", () => {
			matchingFilesCounterController["_viewModel"].searchPattern = "/root/node/path"

			searchedNodeLeaves = [rootNode, rootNode]
			searchedNodeLeaves[0].path = matchingFilesCounterController["_viewModel"].searchPattern
			const blacklist: BlacklistItem[] = [
				{ path: "/root/node/path", type: BlacklistType.exclude },
				{ path: "/root/node/path", type: BlacklistType.hide }
			]

			// On Windows 'ignore' generates paths with backslashes instead of slashes when executing
			// the unit tests, and thus the test case fails without this mock.
			CodeMapHelper.isBlacklisted = jest.fn((node, blacklist, type) => {
				return (
					(type == BlacklistType.hide && node.path == "/root/node/path") ||
					(type == BlacklistType.exclude && node.path == "/root/node/path")
				)
			})

			matchingFilesCounterController["updateViewModel"](searchedNodeLeaves, blacklist)

			expect(matchingFilesCounterController["_viewModel"].fileCount).toEqual(searchedNodeLeaves.length)
			expect(matchingFilesCounterController["_viewModel"].hideCount).toEqual(2)
			expect(matchingFilesCounterController["_viewModel"].excludeCount).toEqual(2)
		})
	})

	describe("getSearchedNodeLeaves", () => {
		it("should return array of nodes leaves", () => {
			const rootNode = VALID_NODE_WITH_PATH
			const searchNodes = [
				rootNode,
				rootNode.children[0],
				rootNode.children[1].children[0],
				rootNode.children[1].children[1],
				rootNode.children[1].children[2]
			]
			const nodeLeaves = [
				rootNode.children[0],
				rootNode.children[1].children[0],
				rootNode.children[1].children[1],
				rootNode.children[1].children[2]
			]
			const result = matchingFilesCounterController["getSearchedNodeLeaves"](searchNodes)

			expect(result).toEqual(nodeLeaves)
		})
	})
})