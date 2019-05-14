import "../../state/state.module";

import angular from "angular";

import {nodeSpikeComponent} from "./nodeSpike.component";

angular.module("app.codeCharta.ui.nodeSpike", ["app.codeCharta.state"])
    .component(nodeSpikeComponent.selector, nodeSpikeComponent);


