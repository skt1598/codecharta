import { SettingsService } from "../../state/settingsService/settings.service"
import { Settings, RecursivePartial, AppSettings } from "../../codeCharta.model"
import { IRootScopeService } from "angular"
import _ from "lodash"
import { SettingsServiceSubscriber } from "../../state/settingsService/settings.service.events"

export class DialogGlobalSettingsController implements SettingsServiceSubscriber {
	private _viewModel: {
		hideFlatBuildings: boolean
		isWhiteBackground: boolean
		resetCameraIfNewFileIsLoaded: boolean
	} = {
		hideFlatBuildings: null,
		isWhiteBackground: null,
		resetCameraIfNewFileIsLoaded: null
	}

	constructor(private $mdDialog, private $rootScope: IRootScopeService, private settingsService: SettingsService) {
		SettingsService.subscribe(this.$rootScope, this)
		this.updateSettingsFields()
	}

	public onSettingsChanged(settings: Settings, update: RecursivePartial<Settings>) {
		this.updateSettingsFields(settings)
	}

	private updateSettingsFields(settings: Settings = this.settingsService.getSettings()) {
		const interestingKeys = _.keys(this._viewModel)
		const viewModelUpdate = _.pick(settings.appSettings, interestingKeys)
		_.assign(this._viewModel, viewModelUpdate)
	}

	public applySettings(update: RecursivePartial<AppSettings> = this._viewModel) {
		this.settingsService.updateSettings({
			appSettings: update
		})
	}

	public hide() {
		this.$mdDialog.hide()
	}
}

export const dialogGlobalSettingsComponent = {
	selector: "dialogGlobalSettingsComponent",
	template: require("./dialog.globalSettings.component.html"),
	controller: DialogGlobalSettingsController,
	clickOutsideToClose: true,
	controllerAs: "$ctrl"
}
