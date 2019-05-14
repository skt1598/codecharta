import "./nodeSpike.component.scss"
import _ from "lodash"
declare var STANDALONE: String

export class NodeSpikeController {

	public env

	constructor() {
		this.env = STANDALONE
	}

}

export const nodeSpikeComponent = {
	selector: "nodeSpikeComponent",
	template: require("./nodeSpike.component.html"),
	controller: NodeSpikeController
}
