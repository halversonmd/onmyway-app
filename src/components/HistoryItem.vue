<template>
  <q-item>
    <q-item-section>
      <q-item-label>{{ startDate }}</q-item-label>
      <q-item-label caption>{{ duration }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { defineComponent, watch, ref } from "vue";
import { date } from "quasar";
const { getDateDiff, formatDate } = date;
export default defineComponent({
  name: "HIstoryItem",
  setup(props) {
    const duration = ref("");
    const startDate = ref("");
    watch(props, () => {
      console.log("data: ", props.data);
      let start = new Date(props.data.startTime);
      let end = new Date(props.data.endTime);
      startDate.value = `${formatDate(start, "MMMM Do, YYYY")} at ${formatDate(
        start,
        "h:mm A"
      )}`;
      if (props.data.endTime == undefined) {
        if (props.data.coords && props.data.coords.length > 0) {
          end = new Date(props.data.coords[props.data.coords.length - 1].time);
        } else {
          duration.value = "Trip cancelled";
          return;
        }
      }

      let diff = getDateDiff(end, start, "minutes");
      if (diff == Number(NaN)) {
        duration.value = "";
      } else if (diff == 0) {
        diff = getDateDiff(end, start, "seconds");
        duration.value = `${diff} seconds`;
      } else {
        let hours = Math.floor(diff / 60);
        let minutes = diff % 60;
        duration.value = hours
          ? `${hours} hour${hours > 1 ? "s" : ""} ${minutes} minute${
              minutes > 1 ? "s" : ""
            }`
          : `${minutes} minute${minutes > 1 ? "s" : ""}`;
      }
    });
    return {
      duration,
      startDate,
    };
  },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
});
</script>
