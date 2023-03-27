<template>
  <div class="flex flex-center"></div>
</template>

<script>
import { defineComponent, watch } from "vue";
import { user } from "src/composables/user";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "InitialLoading",
  setup() {
    const router = useRouter();

    const next = () => {
      if (user.returningUser !== null) {
        if (user.returningUser) {
          router.push({ name: "main" });
        } else {
          router.push({ name: "welcome" });
        }
      }
    };

    next();
    watch(user, next);

    return;
  },
});
</script>
