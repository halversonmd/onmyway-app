export class Scene {
    constructor() {
        this.add = jest.fn();
        this.remove = jest.fn();
        this.children = [];
    }
}

export class WebGLRenderer {
    constructor() {
        this.setPixelRatio = jest.fn();
        this.setSize = jest.fn();
        this.render = jest.fn();
        this.setAnimationLoop = jest.fn();
    }
}

export class PerspectiveCamera {
    constructor() {
        this.lookAt = jest.fn();
        this.position = {
            set: jest.fn(),
        };
    }
}

export class Vector3 {
    constructor() {}
}

export class AmbientLight {
    constructor() {}
}

export class Group {
    constructor() {
        this.children = [];
        this.rotation = { x: 0, y: 0, z: 0 };
        this.position = { x: 0, y: 0, z: 0 };
    }

    add(child) {
        this.children.push(child);
    }

    clipAction() {}

    remove(child) {
        const index = this.children.indexOf(child);
        if (index !== -1) {
            this.children.splice(index, 1);
        }
    }
}

export class DirectionalLight {
    constructor() {
        this.position = {
            x: 0,
            y: 0,
            z: 0,
            set: jest.fn(),
        };
        this.intensity = 0;
    }
}

export class AnimationMixer {
    constructor(root) {
        this.root = root;
    }

    clipAction() {
        return {
            play: jest.fn(),
        };
    }

    update() {}
}

export const AnimationClip = {
    findByName: jest.fn(),
};

export class Clock {
    constructor() {
        this.getDelta = jest.fn();
        this.getElapsedTime = jest.fn();
    }
}

export default {
    DirectionalLightHelper: jest.fn(),
};
