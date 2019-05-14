import "./nodeSpike.component.scss"
import _ from "lodash"
import { EnvironmentDetector } from "../../util/environmentDetector";
declare var STANDALONE: String

export class NodeSpikeController {

	public isNode: Boolean
	public isNode2: Boolean
	public isNode3: Boolean
	public isNode4: Boolean
	public os: String
	public env

	constructor() {
		this.isNode = require('detect-node')
		this.isNode2 = EnvironmentDetector.isNodeJs()
		this.isNode3 = (typeof process !== 'undefined') && (typeof process.release !== 'undefined') && (process.release.name === 'node')
		this.isNode4 = this.checkthis()
		this.env = process.env.STANDALONE
		this.env = STANDALONE
		console.log(this.env)

		this.os = require('os').platform();
		console.log(require('os'))
	}

	private checkthis(){
		if(typeof process === 'object' && process + '' === '[object process]'){
			return true
		}
		else{
			return false
		}
	}

}

export const nodeSpikeComponent = {
	selector: "nodeSpikeComponent",
	template: require("./nodeSpike.component.html"),
	controller: NodeSpikeController
}
