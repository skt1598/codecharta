import {Settings, SettingsService, SettingsServiceSubscriber} from "../../core/settings/settings.service";
import "./aggregateSettingsPanel.component.scss";
import {DataModel, DataService, DataServiceSubscriber} from "../../core/data/data.service";
import {CodeMap} from "../../core/data/model/CodeMap";

export class AggregateSettingsPanelController implements DataServiceSubscriber, SettingsServiceSubscriber{

    public settings: Settings;
    public data: DataModel;
    public maps: CodeMap[];

    /* @ngInject */
    constructor(
        private settingsService: SettingsService,
        private dataService: DataService,
    ) {
        this.maps = dataService.data.revisions;
        this.settings = settingsService.settings;
        this.data = dataService.data;
        this.dataService.subscribe(this);
        this.settingsService.subscribe(this);
    }

    onAggregateChange(){
        this.settingsService.applySettings();
    }

    onDataChanged(data: DataModel) {
        this.data = data;
        this.onAggregateChange();
    }

    onSettingsChanged(settings: Settings, event: Event) {
        this.settings = settings;
    }

}

export const aggregateSettingsPanelComponent = {
    selector: "aggregateSettingsPanelComponent",
    template: require("./aggregateSettingsPanel.component.html"),
    controller: AggregateSettingsPanelController
};
