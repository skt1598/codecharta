import { createStore, Store } from "redux"
import rootReducer from "./store/reducer"
import { CCAction, FileSettings, FileState, State } from "../codeCharta.model"
import { IRootScopeService } from "angular"
import { splitStateActions } from "./store/state.splitter"
import { FileStateService, FileStateSubscriber } from "./fileState.service"
import { setFileSettings } from "./store/fileSettings/fileSettings.actions"
import { FileStateHelper } from "../util/fileStateHelper"
import { SettingsMerger } from "../util/settingsMerger"
import { LoadingStatusService } from "./loadingStatus.service"

export interface StoreSubscriber {
	onStoreChanged(actionType: string)
}

export class StoreService implements FileStateSubscriber {
	private static STORE_CHANGED_EVENT = "store-changed"
	private store: Store

	/* @ngInject */
	constructor(private $rootScope: IRootScopeService, private loadingStatusService: LoadingStatusService) {
		this.store = createStore(rootReducer)
		FileStateService.subscribe(this.$rootScope, this)
	}

	public onFileStatesChanged(fileStates: FileState[]) {
		this.dispatch(setFileSettings(this.getNewFileSettings(fileStates)))
	}

	public dispatch(action: CCAction, isSilent: boolean = false) {
		if (!isSilent) {
			this.loadingStatusService.updateLoadingMapFlag(true)
		}

		splitStateActions(action).forEach(atomicAction => {
			this.store.dispatch(atomicAction)
			if (!isSilent) {
				this.notify(atomicAction.type)
			}
		})
	}

	public getState(): State {
		return this.store.getState()
	}

	private getNewFileSettings(fileStates: FileState[]): FileSettings {
		let withUpdatedPath = !!FileStateHelper.isPartialState(fileStates)
		let visibleFiles = FileStateHelper.getVisibleFileStates(fileStates).map(x => x.file)
		return SettingsMerger.getMergedFileSettings(visibleFiles, withUpdatedPath)
	}

	private notify(actionType: string) {
		this.$rootScope.$broadcast(StoreService.STORE_CHANGED_EVENT, { actionType: actionType })
	}

	public static subscribe($rootScope: IRootScopeService, subscriber: StoreSubscriber) {
		$rootScope.$on(StoreService.STORE_CHANGED_EVENT, (event, data) => {
			subscriber.onStoreChanged(data.actionType)
		})
	}
}
