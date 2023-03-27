<template>
  <q-page class="flex flex-center bg-darks">
    <div
      class="column full-width window-height items-center justify-start text-whites"
    >
      <WelcomePageAnimation />
      <div class="text-h4 q-mt-md">Welcome to</div>
      <div class="text-h4 q-mt-xs">On My Way Texts</div>
      <div
        class="row q-pa-xl q-mt-xs full-width text-h6 text-weight-regular text-center"
      >
        Save time by ensuring your customer is prepared
      </div>
      <q-btn
        id="start-now"
        class="q-mx-md"
        color="primary"
        label="Start now"
        style="width: 75%"
        size="xl"
        @click="getStarted"
      />
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from "vue";
import { useRouter } from "vue-router";
import WelcomePageAnimation from "src/components/WelcomePageAnimation.vue";

export default defineComponent({
  name: "WelcomePage",
  components: { WelcomePageAnimation },
  setup() {
    const router = useRouter();
    const clicked = ref(0);
    function getStarted() {
      clicked.value += 1;
      router.push({ name: "main" });
    }
    return {
      clicked,
      getStarted,
    };
  },
});
</script>
