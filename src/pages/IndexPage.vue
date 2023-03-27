<template>
  <q-page class="relative-position full-height flex flex-center">
    <div
      class="column no-wrap absolute fit items-center overflow-auto text-white hide-scrollbar bg-dark"
    >
      <div class="text-h5 q-px-md q-mt-xl text-center text-weight-bold">
        Send your live location<br />in three easy steps
      </div>

      <div class="row full-width q-px-lg q-pb-md q-pt-md">
        <q-form class="full-width" greedy @submit="onFirstSendClicked">
          <q-item-label class="q-mt-lg q-mb-xs text-h6 text-weight-regular"
            >1. Choose the number to send from</q-item-label
          >
          <q-btn-toggle
            v-model="sendFrom"
            class="q-mb-md"
            spread
            size="15px"
            text-color="white"
            toggle-color="primary"
            :options="[
              { label: 'Your phone', value: 'phone' },
              {
                label: 'a Generic number',
                value: 'generic',
              },
            ]"
          />
          <q-item-label class="q-mt-lg q-mb-xs text-h6 text-weight-regular"
            >2. Enter text details</q-item-label
          >

          <q-input
            v-model="myName"
            dark
            filled
            class="q-pb-xs"
            label="Your name (visible to recipient)"
            lazy-rules
            :rules="[
              (val) =>
                val.length > 0 || 'Please type the name you want them to see',
            ]"
          />
          <q-input
            v-if="sendFrom == 'generic'"
            dark
            clearable
            v-model="phoneInput"
            class="q-mt-none q-pt-none q-pb-xs"
            filled
            ref="phone"
            label="Recipient's number"
            :mask="
              phoneInput && phoneInput.startsWith('1')
                ? '#-###-###-####'
                : '###-###-####'
            "
            type="tel"
            inputmode="decimal"
            :lazy-rules="true"
            :rules="[validatePhone]"
          />
          <q-item-label class="q-mt-lg q-mb-xs text-h6 text-weight-regular"
            >3. Hit send</q-item-label
          >
          <q-btn
            :loading="shareLoading"
            id="init-send"
            type="submit"
            color="primary"
            label="Send"
            size="xl"
            class="full-width"
          >
            <template v-slot:loading>
              <q-spinner-comment color="dark" />
            </template>
          </q-btn>
          <div
            class="text-h6 text-weight-regular text-center q-pt-xs q-mb-none"
          >
            You can stop at anytime
          </div>
        </q-form>
      </div>
      <div
        ref="bottomLogo"
        class="row justify-center full-width"
        style="flex: 1 1 auto"
      >
        <q-img
          v-if="mounted"
          style="position: absolute; bottom: 25px"
          loading="eager"
          src="icons/2Dlogo_white.svg"
          spinner-color="white"
          :width="`${iconWidth}px`"
          :height="`${iconHeight}px`"
        />
      </div>
    </div>
    <q-dialog v-model="confirmSend">
      <q-card
        style="max-height: 500px; width: 90vw"
        class="bg-info fixed-center"
      >
        <q-card-section
          class="bg-primary text-white row justify-center q-py-md"
        >
          <div style="font-size: 24px; font-weight: 500">CONFIRM</div>
        </q-card-section>
        <q-card-section>
          <q-item>
            <q-item-section>
              <q-item-label class="text-h6 text-center text-white"
                >Send your live location to {{ phoneInput }}</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-card-section>

        <q-card-actions align="between">
          <q-btn label="cancel" color="primary" v-close-popup size="xl" />

          <q-btn
            :loading="initTrackingClicked"
            id="send-btn"
            label="send"
            color="primary"
            icon-right="send"
            v-close-popup
            @click="initTracking"
            size="xl"
          >
            <template v-slot:loading>
              <q-spinner-comment color="dark" />
            </template>
          </q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, watch, ref, onMounted } from "vue";
import {
  createAndSendNewTracker,
  smsBody,
  smsTo,
  shareResult,
  shareLoading,
  trackingLinkSent,
  recipientOpened,
} from "src/composables/firebase";
import { fbLog } from "src/boot/firebase";
import {
  bottomSheetStatus,
  activeBottomSheetComponent,
  loadTrackingAnimation,
} from "src/composables/elements";
import { saveUserName, user } from "src/composables/user";

export default defineComponent({
  name: "IndexPage",

  setup() {
    const mounted = ref(false);
    const bottomLogo = ref(null);
    const myName = ref("");
    const phoneInput = ref("");
    const genericPhone = ref();

    const sendFrom = ref("phone");
    const confirmSend = ref(false);

    const initTrackingClicked = ref(false);

    const iconRatio = 1.361842105263158;
    const iconHeight = ref();
    const iconWidth = ref();

    const setIconSize = () => {
      let divBox = bottomLogo.value.getBoundingClientRect();

      iconHeight.value = divBox.height * 0.75;
      iconWidth.value = iconHeight.value * iconRatio;
      mounted.value = true;
    };
    let ro = new ResizeObserver(setIconSize);

    onMounted(() => {
      loadTrackingAnimation.value = true;
      ro.observe(bottomLogo.value);
      setIconSize();
    });

    const initTracking = () => {
      initTrackingClicked.value = true;
      fbLog(`initTracking_from_${sendFrom.value}`);
      saveUserName(myName.value);
      createAndSendNewTracker({
        to: phoneInput.value,
        name: myName.value,
        sendFrom: sendFrom.value,
      })
        .then(() => {
          initTrackingClicked.value = false;
          if (!shareResult.data?.errorMessage) {
            activeBottomSheetComponent.value = "TrackingInProgress";
            bottomSheetStatus.value = "open";
          }
        })
        .catch((err) => {
          shareLoading.value = false;
          trackingLinkSent.value = false;
          loadTrackingAnimation.value = false;
          recipientOpened.value = false;
          initTrackingClicked.value = false;
        });
    };

    if (user.name) {
      myName.value = user.name;
    }

    watch(user, () => {
      if (user.name) {
        myName.value = user.name;
      }
    });

    return {
      phoneMask: ref("###-###-####"),
      phoneInput,
      smsBody,
      iconHeight,
      iconWidth,
      bottomLogo,
      smsTo,
      confirmSend,
      shareResult,
      mounted,
      shareLoading,
      loadTrackingAnimation,
      sendFrom,
      genericPhone,
      myName,
      window,
      initTrackingClicked,
      initTracking,
      validatePhone: (phoneNum) => {
        if (sendFrom.value == "phone") {
          return true;
        }
        if (phoneNum.length === 14) {
          if (phoneNum[0] != "1") {
            return "Please enter a valid number";
          } else if (phoneNum[4] == "0") {
            return "Please enter a valid number";
          } else if (phoneNum.slice(6, 9) == "555") {
            return "Please enter a valid number";
          }
          return true;
        } else if (phoneNum.length === 12) {
          if (phoneNum[3] == "0") {
            return "Please enter a valid number";
          } else if (phoneNum.slice(3, 8) == "555") {
            return "Please enter a valid number";
          }
          return true;
        } else {
          return "Please enter a valid number";
        }
      },
      onFirstSendClicked: () => {
        loadTrackingAnimation.value = true;
        if (sendFrom.value == "phone") {
          shareLoading.value = true;
          fbLog("onFirstSendClicked_from_phone");
          initTracking();
          return;
        }
        fbLog("onFirstSendClicked_from_generic");
        confirmSend.value = true;
      },
    };
  },
});
</script>

<style lang="sass" scoped>>

.main-div
    overflow-y: hidden

.fade-in
    transition: top .5s ease-out

.from-toggle
    border: 1px solid $primary
</style>
