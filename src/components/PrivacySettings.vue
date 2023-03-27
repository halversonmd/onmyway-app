<template>
  <div class="column fit flat no-border">
    <q-item class="q-my-xl q-py-xl">
      <q-item-label class="text-h6"
        >We collect anonymous analytics data that helps us understand how you
        use the app. This lets us improve your experience and hopefully make the
        app easier to use. Uncheck the box below to disable analytics.
      </q-item-label>
    </q-item>
    <q-item clickable @click="toggleAnalyticsStatus">
      <q-item-section avatar>
        <q-icon
          :name="
            user.analyticsEnabled ? 'check_box' : 'check_box_outline_blank'
          "
          color="primary"
        />
      </q-item-section>
      <q-item-section>
        <q-item-label class="text-h6">Analytics Enabled</q-item-label>
      </q-item-section>
    </q-item>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { updatePrivacySettings, user } from "src/composables/user";

export default defineComponent({
  name: "PrivacySettings",
  setup() {
    return {
      user,
      toggleAnalyticsStatus() {
        user.analyticsEnabled = !user.analyticsEnabled;
        updatePrivacySettings(user.analyticsEnabled);
      },
    };
  },
});
</script>
