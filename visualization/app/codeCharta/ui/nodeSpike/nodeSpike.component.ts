import "./nodeSpike.component.scss"
// Available for node only. Does this break non-node?
import * as fs from "fs"
import * as path from "path"
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

	public open_file() {
		window.open("vscode:///C:/Users/AlexH/Desktop/codecharta/README.md")
	}

	//mac: open
	//windows: start
	public launch_editor() {
		if (STANDALONE !== "true") {
			return
		}

		let cmdString = "start " + "C:/Users/AlexH/Desktop/codecharta/README.md"

		require("child_process").exec(cmdString, (err, stdout, stderr) => {
			if (err) {
				return console.warn(err)
			}
			console.warn(stdout)
		})
	}

	public write_file() {
		fs.writeFile("C:/Users/AlexH/Desktop/testme.txt", "Hey there!", function(err) {
			if (err) {
				return console.log(err)
			}

			console.log("The file was saved!")
		})
	}

	public get_path() {
		var absolutePath = path.resolve("./")
		alert(absolutePath)
	}
}

export const nodeSpikeComponent = {
	selector: "nodeSpikeComponent",
	template: require("./nodeSpike.component.html"),
	controller: NodeSpikeController
}
