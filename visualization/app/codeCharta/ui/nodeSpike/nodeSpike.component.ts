import "./nodeSpike.component.scss"
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

	public launch_editor() {
		var cmdString = "start " + "C:/Users/AlexH/Desktop/codecharta/README.md"

		require("child_process").exec(cmdString, function(err, stdout, stderr) {
			if (err) {
				return console.log(err)
			}
			console.log(stdout)
		})
	}
}

export const nodeSpikeComponent = {
	selector: "nodeSpikeComponent",
	template: require("./nodeSpike.component.html"),
	controller: NodeSpikeController
}
