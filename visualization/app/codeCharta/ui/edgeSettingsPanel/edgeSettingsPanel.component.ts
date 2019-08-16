import "./edgeSettingsPanel.component.scss"
import { RecursivePartial, Settings } from "../../codeCharta.model"
import { IRootScopeService } from "angular"
import { EdgeMetricService } from "../../state/edgeMetric.service"
import { CodeMapActionsService } from "../codeMap/codeMap.actions.service"
import { EdgeMetricSubscriber, SettingsServiceSubscriber } from "../../state/settingsService/settings.service.events"
import { SettingsService } from "../../state/settingsService/settings.service"

export class EdgeSettingsPanelController implements SettingsServiceSubscriber, EdgeMetricSubscriber {
	private _viewModel: {
		amountOfEdgePreviews: number
		totalAffectedBuildings: number
	} = {
		amountOfEdgePreviews: 1,
		totalAffectedBuildings: 1
	}

	/* @ngInject */
	constructor(
		private $rootScope: IRootScopeService,
		private settingsService: SettingsService,
		private edgeMetricService: EdgeMetricService,
		private codeMapActionsService: CodeMapActionsService
	) {
		SettingsService.subscribe(this.$rootScope, this)
		SettingsService.subscribeToEdgeMetric(this.$rootScope, this)
	}

	public onSettingsChanged(settings: Settings, update: RecursivePartial<Settings>) {
		if (update.appSettings && update.appSettings.amountOfEdgePreviews) {
			this._viewModel.amountOfEdgePreviews = update.appSettings.amountOfEdgePreviews
		}
	}

	public onEdgeMetricChanged(edgeMetric: string) {
		this._viewModel.totalAffectedBuildings = this.edgeMetricService.getAmountOfAffectedBuildings(edgeMetric)
	}

	public applySettingsAmountOfEdgePreviews() {
		this.settingsService.updateSettings({ appSettings: { amountOfEdgePreviews: this._viewModel.amountOfEdgePreviews } })
		this.codeMapActionsService.updateEdgePreviews()
	}
}

export const edgeSettingsPanelComponent = {
	selector: "edgeSettingsPanelComponent",
	template: require("./edgeSettingsPanel.component.html"),
	controller: EdgeSettingsPanelController
}
