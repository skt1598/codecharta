"use strict"

/* We need to override this jshint suggestion because we need to attach a callback function to an object with values
only available in the loop. We cannot use a named function with parameters because the filereader object wont call it
with the additional ones */

/*jshint loopfunc:true */

import { DialogService } from "../dialog/dialog.service"
import { CodeChartaService } from "../../codeCharta.service"
import { FileStateService } from "../../state/fileState.service"
import { NameDataPair } from "../../codeCharta.model"
import { LoadingStatusService } from "../../state/loadingStatus.service"

export class FileChooserController {
	/* @ngInject */
	constructor(
		private $scope,
		private dialogService: DialogService,
		private codeChartaService: CodeChartaService,
		private fileStateService: FileStateService,
		private loadingStatusService: LoadingStatusService
	) {}

	public onImportNewFiles(element) {
		this.$scope.$apply(() => {
			this.fileStateService.resetMaps()
			for (let file of element.files) {
				let reader = new FileReader()
				reader.onloadstart = () => {
					this.loadingStatusService.updateLoadingFileFlag(true)
				}
				reader.onload = event => {
					this.setNewData(file.name, (<any>event.target).result)
				}
				reader.readAsText(file, "UTF-8")
			}
		})
	}

	public setNewData(fileName: string, content: string) {
		const nameDataPair: NameDataPair = {
			fileName: fileName,
			content: this.getParsedContent(content)
		}

		this.codeChartaService.loadFiles([nameDataPair]).catch(e => {
			this.loadingStatusService.updateLoadingFileFlag(false)
			console.error(e)
			this.printErrors(e)
		})
	}

	private getParsedContent(content: string): any {
		try {
			return JSON.parse(content)
		} catch (error) {
			this.dialogService.showErrorDialog("Error parsing JSON!" + error)
		}
	}

	private printErrors(errors: Object) {
		this.dialogService.showErrorDialog(JSON.stringify(errors, null, "\t"))
	}
}

export const fileChooserComponent = {
	selector: "fileChooserComponent",
	template: require("./fileChooser.component.html"),
	controller: FileChooserController
}
