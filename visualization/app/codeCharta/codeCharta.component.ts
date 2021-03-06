import { UrlExtractor } from "./util/urlExtractor"
import { IHttpService, ILocationService } from "angular"
import "./codeCharta.component.scss"
import { CodeChartaService } from "./codeCharta.service"
import { ScenarioHelper } from "./util/scenarioHelper"
import { DialogService } from "./ui/dialog/dialog.service"
import { NameDataPair } from "./codeCharta.model"
import { FileStateService } from "./state/fileState.service"
import { LoadingStatusService } from "./state/loadingStatus.service"
import { InjectorService } from "./state/injector.service"
import { StoreService } from "./state/store.service"
import { setState } from "./state/store/state.actions"
import { setAppSettings } from "./state/store/appSettings/appSettings.actions"

export class CodeChartaController {
	private _viewModel: {
		version: string
		isLoadingFile: boolean
		isLoadingMap: boolean
	} = {
		version: require("../../package.json").version,
		isLoadingFile: true,
		isLoadingMap: true
	}

	private urlUtils: UrlExtractor

	/* @ngInject */
	constructor(
		private $location: ILocationService,
		private $http: IHttpService,
		private storeService: StoreService,
		private dialogService: DialogService,
		private codeChartaService: CodeChartaService,
		private fileStateService: FileStateService,
		private loadingStatusService: LoadingStatusService,
		// tslint:disable-next-line
		private injectorService: InjectorService // We have to inject it somewhere
	) {
		this.urlUtils = new UrlExtractor(this.$location, this.$http)
		this.loadingStatusService.updateLoadingFileFlag(true)
		this.loadFileOrSample()
	}

	public loadFileOrSample() {
		return this.urlUtils
			.getFileDataFromQueryParam()
			.then((data: NameDataPair[]) => {
				if (data.length > 0) {
					this.tryLoadingFiles(data)
					this.setRenderStateFromUrl()
				} else {
					this.tryLoadingSampleFiles()
				}
			})
			.catch(() => {
				this.tryLoadingSampleFiles()
			})
	}

	public tryLoadingSampleFiles() {
		if (this.urlUtils.getParameterByName("file")) {
			this.dialogService.showErrorDialog(
				"One or more files from the given file URL parameter could not be loaded. Loading sample files instead."
			)
		}
		this.tryLoadingFiles([
			{ fileName: "sample1.cc.json", content: require("./assets/sample1.cc.json") },
			{ fileName: "sample2.cc.json", content: require("./assets/sample2.cc.json") }
		])
	}

	private tryLoadingFiles(values: NameDataPair[]) {
		this.storeService.dispatch(setAppSettings())

		this.codeChartaService
			.loadFiles(values)
			.then(() => {
				this.storeService.dispatch(setState(ScenarioHelper.getDefaultScenario().settings))
			})
			.catch(e => {
				this.loadingStatusService.updateLoadingFileFlag(false)
				console.error(e)
				this.printErrors(e)
			})
	}

	private setRenderStateFromUrl() {
		const renderState: string = this.urlUtils.getParameterByName("mode")
		const files = this.fileStateService.getCCFiles()

		if (renderState === "Delta" && files.length >= 2) {
			this.fileStateService.setDelta(files[0], files[1])
		} else if (renderState === "Multiple") {
			this.fileStateService.setMultiple(files)
		} else {
			this.fileStateService.setSingle(files[0])
		}
	}

	private printErrors(errors: Object) {
		this.dialogService.showErrorDialog(JSON.stringify(errors, null, "\t"))
	}
}

export const codeChartaComponent = {
	selector: "codeChartaComponent",
	template: require("./codeCharta.component.html"),
	controller: CodeChartaController
}
