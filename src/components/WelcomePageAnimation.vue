<template>
  <div class="q-mt-xl" ref="container"></div>
</template>

<script>
import { defineComponent, ref, onMounted } from "vue";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import {
  Scene,
  AnimationMixer,
  WebGLRenderer,
  AnimationClip,
  Clock,
  PerspectiveCamera,
  Group,
  DirectionalLight,
  AmbientLight,
  Vector3,
} from "three";

export default defineComponent({
  name: "WelcomePageAnimation",
  setup() {
    const container = ref(null);

    onMounted(() => {
      init();
    });
    const init = () => {
      const loader = new GLTFLoader();
      const scene = new Scene();

      let model, camera, mixer, group, cameraTarget;

      const degreesToRadians = (degrees) => degrees * (Math.PI / 180);

      const mainContainerDiv = container.value;
      const renderer = new WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth * 0.95, 200);
      if (renderer.domElement) {
        mainContainerDiv.appendChild(renderer.domElement);
      }

      camera = new PerspectiveCamera(
        35,
        (window.innerWidth * 0.95) / 200,
        0.1,
        2000
      );
      camera.position.set(0, 0, 30);

      cameraTarget = new Vector3(0, 0, 0);

      group = new Group();
      scene.add(group);

      scene.add(new AmbientLight(0xf0f0f0));

      loader.load("assets/logo_anim_web.glb", function (gltf) {
        model = gltf.scene;
        group.add(model);

        group.rotation.y = degreesToRadians(90);
        group.rotation.x = degreesToRadians(180);
        group.position.z += 19;
        group.position.x += -2.5;
        camera.lookAt(cameraTarget);

        const light = new DirectionalLight(0xffffff, 1.5);
        light.position.set(5, -5, 0); //default; light shining from top
        light.intensity = 2.75;

        group.add(light);

        mixer = new AnimationMixer(model);
        var clip = AnimationClip.findByName(
          gltf.animations,
          "shadow_circleAction"
        );

        var action1 = mixer.clipAction(clip);
        action1.play();
      });

      const clock = new Clock();

      const animate = () => {
        if (mixer) {
          mixer.update(clock.getDelta());
        }
        if (scene && camera) {
          renderer.render(scene, camera);
        }
      };
      renderer.setAnimationLoop(animate);
    };
    return {
      container,
    };
  },
});
</script>
