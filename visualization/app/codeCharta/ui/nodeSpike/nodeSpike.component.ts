import "./nodeSpike.component.scss"
import _ from "lodash"
declare var STANDALONE: String

export class NodeSpikeController {

	public env: String

	constructor() {
		this.env = STANDALONE
	}

	public exclusive() {
		alert("1")
	}

	public open_folder() {
		window.open("file:///C:/Users/AlexH/Desktop/codecharta/")
	}

	public launch_editor() {
		window.open("file:///C:/Users/AlexH/Desktop/codecharta/README.md")
	}

}

export const nodeSpikeComponent = {
	selector: "nodeSpikeComponent",
	template: require("./nodeSpike.component.html"),
	controller: NodeSpikeController
}
