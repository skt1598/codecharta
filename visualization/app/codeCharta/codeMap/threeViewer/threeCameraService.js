"use strict";

import * as THREE from "three";

/**
 * Manages the three js camera in an angular way.
 */
class ThreeCameraService {

    /**
     * @constructor
     * @external {PerspectiveCamera} https://threejs.org/docs/#Reference/Cameras/PerspectiveCamera
     */
    constructor() {
        /**
         * @type {PerspectiveCamera}
         */
        this.camera = {};
    }

    /**
     * Inits the camera with a specific container width and height
     * @param containerWidth initial width
     * @param containerHeight initial height
     */
    init(containerWidth, containerHeight) {
        var cameraHeight = 300;
        var cameraDistance = 1000;
        var VIEW_ANGLE = 45;
        var ASPECT = containerWidth / containerHeight;
        var NEAR = 0.1;
        var FAR = 20000;

        this.camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
        this.camera.position.set(0, cameraHeight, cameraDistance);
    }

}

export {ThreeCameraService};




