<template>
  <q-layout view="lHh Lpr lFf">
    <q-header class="bg-primary">
      <q-toolbar class="row">
        <div class="col">
          <q-btn
            icon="menu"
            size="lg"
            flat
            padding="none"
            :disable="bottomSheetStatus == 'open'"
          >
            <q-menu
              class="text-dark text-h6"
              ransition-show="jump-down"
              transition-hide="jump-up"
            >
              <q-list class="q-gutter-y-md" style="min-width: 100px">
                <q-item clickable v-close-popup v-ripple @click="openContactUs">
                  <q-item-section>Contact Us</q-item-section>
                </q-item>
                <q-item
                  clickable
                  v-close-popup
                  v-ripple
                  @click="openPrivacySettings"
                >
                  <q-item-section>Privacy Settings</q-item-section>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
        <q-toolbar-title
          class="column col-6 items-center"
          style="font-size: 24px; font-weight: 500"
        >
          On My Way!
        </q-toolbar-title>
        <div class="col column items-end">
          <q-btn
            :disable="bottomSheetStatus == 'open'"
            flat
            icon="history"
            size="lg"
            aria-label="Menu"
            padding="none"
            @click="toggleRightDrawer"
          />
        </div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="rightDrawerOpen" show-if-above bordered side="right">
      <q-list>
        <q-item class="justify-left q-mt-lg">
          <q-item-label style="font-size: 24px; font-weight: 500"
            >History</q-item-label
          >
        </q-item>
        <q-item v-if="Object.keys(history).length == 0">Empty</q-item>
        <div v-else>
          <HistoryItem
            v-for="(historyItemData, trackerId) in history"
            :key="trackerId"
            :data="historyItemData"
          >
          </HistoryItem>
        </div>
      </q-list>
    </q-drawer>
    <div
      :style="{
        position: 'absolute',
        top: bottomSheetTop,
        height: bottomSheetHeight,
      }"
      style="z-index: 5000; border-radius: 10px 10px 0px 0px"
      class="fade-in full-width bg-white shadow-2"
    >
      <div
        class="row full-width justify-end"
        style="height: 0px"
        v-if="activeBottomSheetComponent != 'TrackingInProgress'"
      >
        <q-btn
          icon="close"
          flat
          size="lg"
          color="info"
          @click="setBottomSheetClosed"
        />
      </div>
      <TrackingInProgress
        v-if="activeBottomSheetComponent == 'TrackingInProgress'"
      />
      <ContactUs v-if="activeBottomSheetComponent == 'ContactUs'" />
      <PrivacySettings v-if="activeBottomSheetComponent == 'PrivacySettings'" />
    </div>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import HistoryItem from "src/components/HistoryItem.vue";
import TrackingInProgress from "src/components/TrackingInProgress.vue";
import ContactUs from "src/components/ContactUs.vue";
import PrivacySettings from "src/components/PrivacySettings.vue";
import { history } from "src/composables/user";
import { endWatch } from "src/composables/firebase";
import {
  bottomSheetStatus,
  activeBottomSheetComponent,
} from "src/composables/elements";

export default defineComponent({
  name: "MainLayout",
  components: { HistoryItem, TrackingInProgress, ContactUs, PrivacySettings },
  setup() {
    const rightDrawerOpen = ref(false);
    const bottomSheetTopNum = ref(window.innerHeight + 10);
    const bottomSheetTop = ref(`${bottomSheetTopNum.value}px`);
    const bottomSheetHeight = `${
      window.innerHeight - window.innerHeight * 0.1
    }px`;

    const openBottomSheet = () => {
      bottomSheetTopNum.value = window.innerHeight * 0.1;
      bottomSheetTop.value = `${bottomSheetTopNum.value}px`;
    };

    const closeBottomSheet = () => {
      bottomSheetTopNum.value = window.innerHeight + 10;
      bottomSheetTop.value = `${bottomSheetTopNum.value}px`;
    };

    const toggleBottomSheet = () => {
      if (bottomSheetStatus.value == "open") {
        openBottomSheet();
      } else {
        closeBottomSheet();
      }
    };
    toggleBottomSheet();
    watch(bottomSheetStatus, toggleBottomSheet);

    return {
      activeBottomSheetComponent,
      history,
      bottomSheetHeight,
      bottomSheetStatus,
      bottomSheetTop,
      rightDrawerOpen,
      openContactUs: () => {
        activeBottomSheetComponent.value = "ContactUs";
        bottomSheetStatus.value = "open";
      },
      openPrivacySettings: () => {
        activeBottomSheetComponent.value = "PrivacySettings";
        bottomSheetStatus.value = "open";
      },
      setBottomSheetClosed: () => {
        bottomSheetStatus.value = "closed";
        if (activeBottomSheetComponent.value == "TrackingInProgress") {
          endWatch();
        }
      },
      toggleRightDrawer() {
        rightDrawerOpen.value = !rightDrawerOpen.value;
      },
    };
  },
});
</script>

<style lang="sass" scoped>>
.fade-in
    transition: top .25s ease-out
</style>
