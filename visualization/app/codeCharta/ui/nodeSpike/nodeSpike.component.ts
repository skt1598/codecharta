import "./nodeSpike.component.scss"
declare var STANDALONE: String

export class NodeSpikeController {
	public env: String
	public folder: String = "C:/Users/AlexH/Desktop/codecharta"
	public file: String = "README.md"

	constructor() {
		this.env = STANDALONE
	}

	public exclusive() {
		alert("1")
	}

	public open_folder() {
		window.open("file:///" + this.folder)
	}

	public open_file() {
		window.open("vscode:///" + this.folder + "/" + this.file)
	}

	//mac: open
	//windows: start
	public launch_editor() {
		let child_process = null
		if (STANDALONE === "true") {
			child_process = require("child_process")
		} else {
			return
		}

		let cmdString = "start " + this.folder + "/" + this.file

		child_process.exec(cmdString, (err, stdout, stderr) => {
			if (err) {
				return console.warn(err)
			}
			console.warn(stdout)
		})
	}

	public write_file() {
		// import * as fs from "fs" will break non-standalone version
		if (STANDALONE !== "true") {
			return
		}
		const fs = require("fs")
		fs.writeFile(this.folder + "/" + this.file, "Hey there!", function(err) {
			if (err) {
				return alert(err)
			}

			alert("The file was saved!")
		})
	}

	public get_path() {
		// import * as path from "path" will break non-standalone version
		if (STANDALONE !== "true") {
			return
		}
		const path = require("path")
		var absolutePath = path.resolve("./")
		alert(absolutePath)
	}
}

export const nodeSpikeComponent = {
	selector: "nodeSpikeComponent",
	template: require("./nodeSpike.component.html"),
	controller: NodeSpikeController
}
