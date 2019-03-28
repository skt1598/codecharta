import { FileSelectionState, MapColors, RecursivePartial, Settings, Vector3d } from "../codeCharta.model"
import _ from "lodash"
import { IAngularEvent, IRootScopeService } from "angular"

export interface SettingsServiceSubscriber {
	onSettingsChanged(settings: Settings, event: IAngularEvent)
}

export class SettingsService {
	public static SELECTOR = "settingsService"
	private static SETTINGS_CHANGED_EVENT = "settings-changed"
	public static readonly MIN_MARGIN = 15

	public settings: Settings
	private readonly throttledBroadcast: () => void

	constructor(private $rootScope) {
		this.settings = this.getDefaultSettings()
		this.throttledBroadcast = _.throttle(() => this.$rootScope.$broadcast(SettingsService.SETTINGS_CHANGED_EVENT, this.settings), 400)
	}

	public getSettings(): Settings {
		return this.settings
	}

	public updateSettings(update: RecursivePartial<Settings>) {
		// _.merge(this.settings, update) didnt work with arrays like blacklist
		this.settings = this.updateSettingsUsingPartialSettings(this.settings, update)
		console.log("settingsUpdate", update, this.settings)
		this.throttledBroadcast()
	}

	public getDefaultSettings(): Settings {
		const mapColors: MapColors = {
			positive: "#69AE40",
			neutral: "#ddcc00",
			negative: "#820E0E",
			selected: "#EB8319",
			defaultC: "#89ACB4",
			positiveDelta: "#69FF40",
			negativeDelta: "#ff0E0E",
			base: "#666666",
			flat: "#AAAAAA",
			lightGrey: "#DDDDDD",
			angularGreen: "#00BFA5",
			markingColors: ["#FF1D8E", "#1d8eff", "#1DFFFF", "#8eff1d", "#8e1dff", "#FFFF1D"]
		}

		const scaling: Vector3d = {
			x: 1,
			y: 1,
			z: 1
		}

		const camera: Vector3d = {
			x: 0,
			y: 300,
			z: 1000
		}

		let settings: Settings = {
			fileSettings: {
				attributeTypes: {},
				blacklist: [],
				edges: [],
				markedPackages: []
			},
			dynamicSettings: {
				areaMetric: null,
				heightMetric: null,
				colorMetric: null,
				focusedNodePath: null,
				searchedNodePaths: [],
				searchPattern: "",
				margin: SettingsService.MIN_MARGIN,
				neutralColorRange: null
			},
			appSettings: {
				amountOfTopLabels: 1,
				scaling: scaling,
				camera: camera,
				deltaColorFlipped: false,
				enableEdgeArrows: true,
				hideFlatBuildings: true,
				maximizeDetailPanel: false,
				invertHeight: false,
				dynamicMargin: true,
				isWhiteBackground: false,
				whiteColorBuildings: false,
				mapColors: mapColors
			},
			treeMapSettings: {
				mapSize: 500
			}
		}

		return settings
	}

	private updateSettingsUsingPartialSettings(settings: Settings, update: RecursivePartial<Settings>): Settings {
		for (let key of Object.keys(settings)) {
			if (update.hasOwnProperty(key)) {
				if (this.isObject(settings[key]) && !this.isArray(settings[key])) {
					if (this.containsArrayObject(update[key])) {
						settings[key] = this.updateSettingsUsingPartialSettings(settings[key], update[key])
					} else {
						settings[key] = _.merge(settings[key], update[key])
					}
				} else {
					settings[key] = update[key]
				}
			}
		}
		return settings
	}

	private containsArrayObject(obj: Object): boolean {
		if (obj) {
			for (let key of Object.keys(obj)) {
				if (typeof obj[key] === "object") {
					if (Object.prototype.toString.call(obj[key]) === "[object Array]") {
						return true
					} else {
						return this.containsArrayObject(obj[key])
					}
				}
			}
		}
		return false
	}

	private isArray(obj: object) {
		return Object.prototype.toString.call(obj) === "[object Array]"
	}

	private isObject(obj: object) {
		return typeof obj === "object"
	}

	public static subscribe($rootScope: IRootScopeService, subscriber: SettingsServiceSubscriber) {
		$rootScope.$on(SettingsService.SETTINGS_CHANGED_EVENT, (event, data) => {
			subscriber.onSettingsChanged(data, event)
		})
	}

	/* TODO move onCameraChanged(), updateSettings() should offer silent flag (no event triggered)
    public onCameraChanged(camera: PerspectiveCamera) {
        if (
            this.settings.camera.x !== camera.position.x ||
            this.settings.camera.y !== camera.position.y ||
            this.settings.camera.z !== camera.position.z
        ) {
            this.settings.camera.x = camera.position.x;
            this.settings.camera.y = camera.position.y;
            this.settings.camera.z = camera.position.z;
            // There is no component in CC which needs live updates when camera changes. Broadcasting an
            // onSettingsChanged Event would cause big performance issues
            // this.onSettingsChanged();
        }
    }*/

	/* TODO move updateSettingsFromUrl() to urlUtils
    public updateSettingsFromUrl() {

        let iterateProperties = (obj, prefix) => {
            for (let i in obj) {
                if (obj.hasOwnProperty(i) && i !== "map" && i) {

                    if (typeof obj[i] === "string" || obj[i] instanceof String) {
                        //do not iterate over strings
                    } else {
                        iterateProperties(obj[i], i + ".");
                    }

                    const res = this.urlService.getParam(prefix + i);

                    if (res) {

                        if (res == "true") {
                            obj[i] = true;
                        } else if (res == "false") {
                            obj[i] = false;
                        } else if (res === 0 || res) {

                            let val = parseFloat(res);

                            if (isNaN(val)) {
                                val = res;
                            }

                            obj[i] = val;
                        } else {
                            obj[i] = res;
                        }

                        // if we work with strings here it can cause errors in other parts of the app, check with console.log(typeof obj[i], obj[i]);
                    }

                }
            }
        };

        iterateProperties(this.settings, "");


        this.onSettingsChanged();

    }
    */
}
