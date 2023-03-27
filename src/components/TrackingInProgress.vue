<template>
  <div class="column fit justify-center flat no-border">
    <q-item class="self-center">
      <q-item-section>
        <q-item-label class="text-h4 text-center"
          >Tracking in progress</q-item-label
        >
      </q-item-section>
    </q-item>
    <q-card-section>
      <q-item>
        <q-item-section avatar>
          <q-icon
            :name="trackingLinkSent ? 'check_box' : 'check_box_outline_blank'"
            :color="trackingLinkSent ? 'primary' : 'negative'"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">Link sent</q-item-label>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section avatar>
          <q-icon
            :name="recipientOpened ? 'check_box' : 'check_box_outline_blank'"
            :color="recipientOpened ? 'primary' : 'negative'"
          />
        </q-item-section>
        <q-item-section>
          <q-item-label class="text-h6">Link opened</q-item-label>
        </q-item-section>
      </q-item>
    </q-card-section>
    <q-card-section>
      <TrackingMarkerAnimation v-if="loadTrackingAnimation" />
    </q-card-section>
    <q-card-section>
      <q-btn
        label="stop"
        color="primary"
        v-close-popup
        size="xl"
        class="full-width"
        @click="endWatch"
      />
    </q-card-section>
  </div>
</template>

<script>
import { defineComponent, defineAsyncComponent } from "vue";
import {
  trackingLinkSent,
  recipientOpened,
  endWatch,
} from "src/composables/firebase";
import {
  bottomSheetStatus,
  loadTrackingAnimation,
} from "src/composables/elements";

const TrackingMarkerAnimation = defineAsyncComponent(() =>
  import("src/components/TrackingMarkerAnimation.vue")
);
export default defineComponent({
  name: "TrackingInProgress",
  components: { TrackingMarkerAnimation },
  setup() {
    return {
      loadTrackingAnimation,
      trackingLinkSent,
      recipientOpened,
      endWatch: () => {
        bottomSheetStatus.value = "closed";
        trackingLinkSent.value = false;
        recipientOpened.value = false;
        loadTrackingAnimation.value = false;
        endWatch();
      },
    };
  },
  props: {
    data: {
      type: Object,
      required: false,
    },
  },
});
</script>
