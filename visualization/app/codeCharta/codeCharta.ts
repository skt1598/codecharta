"use strict";

import "./codeMap/codeMap.ts";
import "./core/core.module.ts";
import "./ui/ui.ts";

import {codeChartaComponent, CodeChartaController} from "./codeChartaComponent.ts";

import angular from "angular";

import "./codeCharta.css";

angular.module(
    "app.codeCharta",
    ["app.codeCharta.codeMap", "app.codeCharta.core", "app.codeCharta.ui"]
);

angular.module("app.codeCharta").component(
    codeChartaComponent.selector,
    codeChartaComponent
);


