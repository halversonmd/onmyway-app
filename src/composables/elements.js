import { ref } from "vue";

const bottomSheetStatus = ref("");
const loadTrackingAnimation = ref(false);
const activeBottomSheetComponent = ref("TrackingInProgress");
export { bottomSheetStatus, loadTrackingAnimation, activeBottomSheetComponent };
